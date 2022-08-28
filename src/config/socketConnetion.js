const { AESDecrypt, JWTVerify } = require("../lib/encryption");
const TokenTrackNotif = require("../model/token_track_notif");
const { TrackG20 } = require("../model/tracking/g20");
const moment = require("moment");
const LocationTrackController = require("../controller/track/locationTrack");
const Account = require("../model/account");
const Vehicle = require("../model/vehicle");
const Vip = require("../model/vip");
const Officer = require("../model/officer");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const socketInstace = (server) => {
  const io = require("socket.io")(server, {
    cors: {},
  }).use(async function (socket, next) {
    // authenticate jwt for socket connection
    const { username, password, user_nrp, type } = socket.handshake.query;
    if (type == "Admin") {
      const user = await User.findOne({
        where: {
          username: username,
          status_verifikasi: 1,
        },
      });
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          next(new Error("Authentication error"));
        }
      } else {
        next(new Error("Authentication error"));
      }
    } else if (type == "Officier") {
      try {
        if (socket.handshake.query && socket.handshake.query.user_nrp) {
          let dataAccount = await Account.findOne({
            include: [
              {
                model: Vehicle,
                as: "vehicle",
                foreignKey: "id_vehicle",
                required: false,
              },

              {
                model: Officer,
                as: "officer",
                required: true,
                where: {
                  nrp_officer: socket.handshake.query.user_nrp,
                },
              },
            ],
            where: {
              name_account: username,
            },
          });
          let dataOfficer = await Officer.findOne({
            where: {
              nrp_officer: user_nrp,
            },
          });
          socket.handshake.query["dataAccount"] = dataAccount;
          socket.handshake.query["dataOfficer"] = dataOfficer;
          if (dataAccount) {
            if (bcrypt.compareSync(password, dataAccount.password)) {
              const aaaaa = await TokenTrackNotif.update(
                {
                  token_track: socket.id,
                },
                {
                  where: {
                    team_id: AESDecrypt(dataAccount.id, {
                      isSafeUrl: true,
                      parseMode: "string",
                    }),
                    nrp_user: user_nrp,
                  },
                }
              );

              next();
            } else {
              console.log("kesana");
              return next(new Error("Authentication error"));
            }
          }
        } else {
          next(new Error("Authentication error"));
        }
      } catch (error) {
        console.log(error.message);
        next(new Error("Authentication error"));
      }
    }
  });
  io.on("connection", async (socket) => {
    io.emit("message", "test");
    socket.on("message", function (message) {
      // io.emit("message", message);
      console.log(message);
    });
    socket.on("trackingUser", async function (coordinate) {
      const { username, password, user_nrp, type, dataAccount, dataOfficer } =
        socket.handshake.query;

      let sendTracking = await TrackG20.create({
        id_user: AESDecrypt(dataAccount.id, {
          isSafeUrl: true,
          parseMode: "string",
        }),
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        name_account: dataAccount.name_account,
        // id_officer: dataOfficer.id,
        name_team: dataAccount.leader_team, // [ketua tim]
        // vip: dataAccount.vips.name_vip, // [nama vip]
        nrp_user: dataOfficer.nrp_officer,
        handphone: dataOfficer.phone_officer,
        no_vehicle: dataAccount.vehicle.no_vehicle, // [plat nomor]
        type_vehicle: dataAccount.vehicle.type_vehicle, // ["motor"]
        date: moment(),
      });
      console.log(sendTracking);
      io.emit("sendToAdmin", await LocationTrackController.sendToSocket());
    });
  });
};

module.exports = socketInstace;
