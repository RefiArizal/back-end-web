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
const { Server } = require("socket.io");
const socketInstace = (server) => {
  // const io = require("socket.io")(server, {

  // })
  // const io = new Server(server, {
  const io = require("socket.io")(server);
  // .use(async function (socket, next) {
  //   // authenticate jwt for socket connection
  //   console.log("connected");
  //   try {
  //     const { username, password, user_nrp, type } = socket.handshake.query;
  //     if (type == "Admin") {
  //       const user = await User.findOne({
  //         where: {
  //           username: username,
  //           status_verifikasi: 1,
  //         },
  //       });
  //       if (user) {
  //         if (bcrypt.compareSync(password, user.password)) {
  //           next();
  //         } else {
  //           next(new Error("Authentication error"));
  //         }
  //       } else {
  //         next(new Error("Authentication error"));
  //       }
  //     } else if (type == "Officier") {
  //       try {
  //         if (socket.handshake.query && socket.handshake.query.user_nrp) {
  //           let dataAccount = await Account.findOne({
  //             include: [
  //               {
  //                 model: Vehicle,
  //                 as: "vehicle",
  //                 foreignKey: "id_vehicle",
  //                 required: false,
  //               },
  //               {
  //                 model: Officer,
  //                 as: "officers",
  //                 required: true,
  //                 where: {
  //                   nrp_officer: socket.handshake.query.user_nrp,
  //                 },
  //               },
  //               // {
  //               //   model: Officer,
  //               //   as: "leader_team",
  //               //   required: false,
  //               // },
  //             ],
  //             where: {
  //               name_account: username,
  //             },
  //           });
  //           let dataOfficer = await Officer.findOne({
  //             where: {
  //               nrp_officer: user_nrp,
  //             },
  //           });
  //           socket.handshake.query["dataAccount"] = dataAccount;
  //           socket.handshake.query["dataOfficer"] = dataOfficer;
  //           if (dataAccount) {
  //             if (bcrypt.compareSync(password, dataAccount.password)) {
  //               const aaaaa = await TokenTrackNotif.update(
  //                 {
  //                   token_track: socket.id,
  //                 },
  //                 {
  //                   where: {
  //                     team_id: AESDecrypt(dataAccount.id, {
  //                       isSafeUrl: true,
  //                       parseMode: "string",
  //                     }),
  //                     nrp_user: user_nrp,
  //                   },
  //                 }
  //               );
  //               next();
  //             } else {
  //               console.log("error 1");
  //               return next(new Error("Authentication error"));
  //             }
  //           }
  //         } else {
  //           console.log("error 2");
  //           next(new Error("Authentication error"));
  //         }
  //       } catch (error) {
  //         console.log("error 3");
  //         next(new Error("Authentication error"));
  //       }
  //     }
  //     // else {
  //     //   next();
  //     // }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // });
  io.on("connection", async (socket) => {
    io.emit("message", "test");
    socket.on("trackingUser", async function (coordinate) {
      // const { username, password, user_nrp, type, dataAccount, dataOfficer } =
      //   socket.handshake.query;
      // let officerData = await Officer.findOne({
      //   where: {
      //     id: parseInt(dataAccount?.leader_team),
      //   },
      // });
      // let noTelpon = dataOfficer?.phone_officer;
      // let noDepan = noTelpon.substring(0, 2);
      // if (noDepan === "62") {
      //   noTelpon = noTelpon;
      // } else if (noDepan === "08") {
      //   noTelpon = "62" + noTelpon.substring(1);
      // } else if (noDepan === "+6") {
      //   noTelpon = noTelpon.substring(1);
      // } else {
      //   noTelpon = noTelpon;
      // }
      const dataOfficerOke = {
        id_user: "25",
        latitude: -6.624758720397949,
        longitude: 106.79884338378906,
        name_account: "timdev1",
        id_officer: "81",
        name_officer: "dev3",
        photo_officer: null,
        rank_officer: "AIPTU",
        nrp_user: "9003",
        handphone: "6289605929239",
        photo_officer_telp_biasa: "+6289605929239",
        no_vehicle: "F 1 AA",
        type_vehicle: "Mobil",
        fuel_vehicle: "Bensin",
        back_number_vehicle: null,
        date: "2022-10-19",
        dateOnly: "2022-10-19",
      };
      // const dataOfficerOke = {
      //   id_user: AESDecrypt(dataAccount.id, {
      //     isSafeUrl: true,
      //     parseMode: "string",
      //   }),
      //   latitude: coordinate.lat,
      //   longitude: coordinate.lon,
      //   name_account: dataAccount.dataValues.name_account,
      //   id_officer: AESDecrypt(dataOfficer.id, {
      //     isSafeUrl: true,
      //     parseMode: "string",
      //   }),
      //   // name_team: officerData.dataValues.name_officer, // [ketua tim]
      //   name_officer: dataOfficer.name_officer,
      //   photo_officer: dataOfficer.photo_officer,
      //   rank_officer: dataOfficer.rank_officer,
      //   nrp_user: dataOfficer.nrp_officer,
      //   handphone: noTelpon,
      //   photo_officer_telp_biasa: "+" + noTelpon,
      //   no_vehicle: dataAccount.vehicle.no_vehicle, // [plat nomor]
      //   type_vehicle: dataAccount.vehicle.type_vehicle, // ["motor"]
      //   fuel_vehicle: dataAccount.vehicle.fuel_vehicle, //
      //   back_number_vehicle: dataAccount.vehicle.back_number_vehicle, //
      //   date: moment().format("YYYY-MM-DD"),
      //   dateOnly: moment().format("YYYY-MM-DD"),
      // };
      // console.log(dataOfficerOke);
      io.emit("trackme", dataOfficerOke);

      socket.broadcast.emit("sendToAdminMobile", dataOfficerOke);
      socket.broadcast.emit("sendToAdminMobileNew", dataOfficerOke);
      io.emit("sendToAdminMobileNew2", dataOfficerOke);
      socket.broadcast.emit("sendToAdmin", dataOfficerOke);

      // await TrackG20.create(dataOfficerOke);
    });
  });
};

module.exports = socketInstace;
