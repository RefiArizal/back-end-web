const db = require("../config/database");
const response = require("../lib/response");
const moment = require("moment");
const Input_operasi_dikmaslantas = require("../model/operasi_lg_dikmaslantas");
const { Op, Sequelize } = require("sequelize");
const _ = require("lodash");
const { AESDecrypt } = require("../lib/encryption");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");

const decAes = (token) =>
  AESDecrypt(token, {
    isSafeUrl: true,
    parseMode: "string",
  });
module.exports = class OperasiDikmaslantasController {
  static add = async (req, res) => {
    const transaction = await db.transaction();
    try {
      const { polda } = req.query;
      if (polda) {
        let dataInputPolda = [];
        req.body?.value.map((item) => {
          dataInputPolda.push({
            polda_id: decAes(req.body.polda_id),
            date: req.body.date,
            polres_id: decAes(item.polres_id),
            operasi_id: decAes(req.body.operasi_id),
            media_cetak: item.media_cetak,
            media_sosial: item.media_sosial,
            media_elektronik: item.media_elektronik,
            laka_langgar: item.laka_langgar,
          });
        });
        let insertDataPolda = await Input_operasi_dikmaslantas.bulkCreate(
          dataInputPolda,
          { transaction: transaction }
        );
      } else {
        let checkData = await Input_operasi_dikmaslantas.findOne({
          where: {
            polda_id: decAes(req.body.polda_id),
            polres_id: decAes(req.body.polres_id),
            date: req.body.date,
            operasi_id: decAes(req.body.operasi_id),
          },
        });
        let inputData = {
          polda_id: decAes(req.body.polda_id),
          polres_id: decAes(req.body.polres_id),
          date: req.body.date,
          operasi_id: decAes(req.body.operasi_id),
          media_cetak: req.body.media_cetak,
          media_sosial: req.body.media_sosial,
          media_elektronik: req.body.media_elektronik,
          laka_langgar: req.body.laka_langgar,
        };
        if (checkData) {
          let updateData = await Input_operasi_dikmaslantas.update(inputData, {
            where: {
              polda_id: decAes(req.body.polda_id),
              polres_id: decAes(req.body.polres_id),
              date: req.body.date,
              operasi_id: decAes(req.body.operasi_id),
            },
            transaction: transaction,
          });
        } else {
          let insertData = await Input_operasi_dikmaslantas.create(inputData, {
            transaction: transaction,
          });
        }
      }
      await transaction.commit();
      response(res, true, "Succeed", null);
    } catch (error) {
      await transaction.rollback();
      response(res, false, "Failed", error.message);
    }
  };

  static add = async (req, res) => {
    const transaction = await db.transaction();
    try {
      let dataInputPolda = [];
      req.body?.value.map((item) => {
        dataInputPolda.push({
          polda_id: decAes(item.polda_id),
          date: item.date,
          operasi_id: decAes(item.operasi_id),
          media_cetak: item.media_cetak,
          media_sosial: item.media_sosial,
          media_elektronik: item.media_elektronik,
          laka_langgar: item.laka_langgar,
        });
      });
      let insertDataPolda = await Input_operasi_dikmaslantas.bulkCreate(
        dataInputPolda,
        { transaction: transaction }
      );
      await transaction.commit();
      response(res, true, "Succeed", null);
    } catch (error) {
      await transaction.rollback();
      response(res, false, "Failed", error.message);
    }
  };
};
