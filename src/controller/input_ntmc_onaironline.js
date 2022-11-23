const db = require("../config/database");
const response = require("../lib/response");
const moment = require("moment");
const Ntmc_onair_online = require("../model/ntmc_onair_mediaonline");
const { Op, Sequelize } = require("sequelize");
const _ = require("lodash");
const { AESDecrypt } = require("../lib/encryption");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const Ntmc_onair_mediaonline = require("../model/ntmc_onair_mediaonline");

module.exports = class NtmcOnAirTVController {
  static get_by_date = async (req, res) => {
    let start_of_month = moment().startOf("years").format("YYYY-MM-DD");
    let end_of_month = moment().endOf("years").format("YYYY-MM-DD");
    try {
      const {
        type = null,
        start_date = null,
        end_date = null,
        filter = null,
        date = null,
        serverSide = null,
        length = null,
        start = null,
        polda_id = null,
        topPolda = null,
      } = req.query;

      var list_day = [];
      var list_month = [];

      for (
        var m = moment(start_date);
        m.isSameOrBefore(end_date);
        m.add(1, "days")
      ) {
        list_day.push(m.format("YYYY-MM-DD"));
      }

      for (
        var m = moment(start_date);
        m.isSameOrBefore(end_date);
        m.add(1, "month")
      ) {
        list_month.push(m.format("MMMM"));
      }

      let wheres = {};
      if (date) {
        wheres.date = date;
      }

      if (filter) {
        wheres.date = {
          [Op.between]: [start_date, end_date],
        };
      }

      const getDataRules = {
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("web_ntmc")), "web_ntmc"],
          [
            Sequelize.fn("sum", Sequelize.col("web_korlantas")),
            "web_korlantas",
          ],
          [Sequelize.literal("SUM(web_ntmc + web_korlantas)"), "total"],
        ],
        where: wheres,
      };

      if (type === "day") {
        getDataRules.group = "date";
        getDataRules.attributes.push("date");
      } else if (type === "month") {
        getDataRules.group = "month";
        getDataRules.attributes.push([
          Sequelize.fn("date_trunc", "month", Sequelize.col("date")),
          "month",
        ]);
      }

      let rows = await Ntmc_onair_mediaonline.findAll(getDataRules);

      let finals = [];
      if (type === "day") {
        const asd = list_day.map((item, index) => {
          const data = rows.find((x) => x.dataValues.date == item);
          if (data) {
            finals.push({
              web_ntmc: parseInt(data.dataValues.web_ntmc),
              web_korlantas: parseInt(data.dataValues.web_korlantas),
              total: parseInt(data.dataValues.total),
              date: data.date,
            });
          } else {
            finals.push({
              web_ntmc: 0,
              web_korlantas: 0,
              total: 0,
              date: item,
            });
          }
        });
      } else if (type === "month") {
        let abc = rows.map((element, index) => {
          return {
            web_ntmc: parseInt(element.dataValues.web_ntmc),
            web_korlantas: parseInt(element.dataValues.web_korlantas),
            total: parseInt(element.dataValues.total),
            date: moment(element.dataValues.month).format("MMMM"),
          };
        });

        const asd = list_month.map((item, index) => {
          const data = abc.find((x) => x.date == item);
          if (data) {
            finals.push({
              web_ntmc: parseInt(data.web_ntmc),
              web_korlantas: parseInt(data.web_korlantas),
              total: parseInt(data.total),
              date: data.date,
            });
          } else {
            finals.push({
              web_ntmc: 0,
              web_korlantas: 0,
              total: 0,
              date: item,
            });
          }
        });
      }
      response(res, true, "Succeed", finals);
    } catch (error) {
      response(res, false, "Failed", error.message);
    }
  };

  static add = async (req, res) => {
    const transaction = await db.transaction();
    try {
      let inputData = {
        web_ntmc: req.body.web_ntmc,
        web_korlantas: req.body.web_korlantas,
        date: req.body.date,
      };

      let insertData = await Ntmc_onair_online.create(inputData, {
        transaction: transaction,
      });
      await transaction.commit();
      response(res, true, "Succeed", null);
    } catch (error) {
      await transaction.rollback();
      response(res, false, "Failed", error.message);
    }
  };
};
