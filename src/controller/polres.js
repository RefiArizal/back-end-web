const db = require("../config/database");
const response = require("../lib/response");
const Polres = require("../model/polres");
const { Op, Sequelize } = require("sequelize");
const _ = require("lodash");
const { AESDecrypt } = require("../lib/encryption");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const Polda = require("../model/polda");
const pagination = require("../lib/pagination-parser");

const fieldData = {
  polda_id: null,
  name_polres: null,
  code_satpas: null,
  address: null,
  latitude: null,
  longitude: null,
  logo_polres: null,
  phone_polres: null,
  open_time: null,
  close_time: null,
};
module.exports = class PolresController {
  static get = async (req, res) => {
    try {
      const {
        length = 10,
        start = 0,
        serverSide = null,
        search = null,
        filter = [],
        filterSearch = [],
        order = null,
        orderDirection = "asc",
      } = req.query;
      const modelAttr = Object.keys(Polres.getAttributes());
      let getDataRules = { where: null };
      if (serverSide?.toLowerCase() === "true") {
        const resPage = pagination.getPagination(length, start);
        getDataRules.limit = resPage.limit;
        getDataRules.offset = resPage.offset;
      }

      // getDataRules.order = [[modelAttr[order], orderDirection.toUpperCase()]];
      getDataRules.order = [
        [
          order != null ? order : "id",
          orderDirection != null ? orderDirection : "asc",
        ],
      ];

      if (search != null) {
        let whereBuilder = [];
        modelAttr.forEach((key) => {
          whereBuilder.push(
            Sequelize.where(
              Sequelize.fn(
                "lower",
                Sequelize.cast(Sequelize.col(key), "varchar")
              ),
              {
                [Op.like]: `%${search.toLowerCase()}%`,
              }
            )
          );
        });
        getDataRules.where = {
          [Op.or]: whereBuilder,
        };
      }
      if (
        filter != null &&
        filter.length > 0 &&
        filterSearch != null &&
        filterSearch.length > 0
      ) {
        const filters = [];
        filter.forEach((fKey, index) => {
          if (_.includes(modelAttr, fKey)) {
            filters[fKey] = filterSearch[index];
          }
        });
        getDataRules.where = {
          ...getDataRules.where,
          ...filters,
        };
      }
      const data = await Polres.findAll(getDataRules);
      const count = await Polres.count({
        where: getDataRules?.where,
      });
      response(res, true, "Succeed", {
        data,
        recordsFiltered: count,
        recordsTotal: count,
      });
    } catch (e) {
      response(res, false, "Failed", e.message);
    }
  };
  static add = async (req, res) => {
    const transaction = await db.transaction();
    try {
      let fieldValue = {};
      Object.keys(fieldData).forEach((val, key) => {
        if (req.body[val]) {
          fieldValue[val] = req.body[val];
        }
      });
      await Polres.create(fieldValue, { transaction: transaction });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      response(res, false, "Failed", e.message);
    }
  };
  static importExcell = async (req, res) => {
    const t = await db.transaction();
    try {
      let path = req.body.file.filepath;
      let file = req.body.file;
      let fileName = file.originalFilename;
      fs.renameSync(path, "./public/upload/" + fileName, function (err) {
        if (err) response(res, false, "Error", err.message);
      });
      let readExcell = await readXlsxFile("./public/upload/" + fileName);
      let index = 0;
      let listPolres = [];
      let idNotValid = [];
      for (const iterator of readExcell) {
        if (index == 0) {
          if (
            iterator[1] != "ID Polda" &&
            iterator[2] != "Polres" &&
            iterator[3] != "Kode Satpas" &&
            iterator[4] != "Alamat"
          ) {
            response(res, false, "Failed", null);
          }
        } else {
          let getIdPolda = await Polda.findOne({
            where: {
              id: iterator[1],
            },
          });
          if (getIdPolda) {
            listPolres.push({
              polda_id: iterator[1],
              name_polres: iterator[2],
              code_satpas: iterator[3],
              address: iterator[4],
              latitude: iterator[5] || null,
              longitude: iterator[6] || null,
            });
          } else {
            idNotValid.push({
              polda_id: iterator[1],
              name_polres: iterator[2],
              code_satpas: iterator[3],
              address: iterator[4],
              latitude: iterator[5] || null,
              longitude: iterator[6] || null,
            });
          }
        }
        index++;
      }
      const poldaUp = await Polres.bulkCreate(listPolres, {
        transaction: t,
      });
      await t.commit();

      response(res, true, "Succed", poldaUp);
    } catch (error) {
      await t.rollback();
      response(res, false, "Failed", error.message);
    }
  };
  static edit = async (req, res) => {
    const transaction = await db.transaction();
    try {
      let fieldValue = {};
      Object.keys(fieldData).forEach((val, key) => {
        if (req.body[val]) {
          fieldValue[val] = req.body[val];
        }
      });
      await Polres.update(fieldValue, {
        where: {
          id: AESDecrypt(req.params.id, {
            isSafeUrl: true,
            parseMode: "string",
          }),
        },
        transaction: transaction,
      });
      await transaction.commit();
      response(res, true, "Succeed", null);
    } catch (e) {
      await transaction.rollback();
      response(res, false, "Failed", e.message);
    }
  };
  static delete = async (req, res) => {
    const transaction = await db.transaction();
    try {
      await Polres.destroy({
        where: {
          id: AESDecrypt(req.body.id, {
            isSafeUrl: true,
            parseMode: "string",
          }),
        },
        transaction: transaction,
      });
      await transaction.commit();
      response(res, true, "Succeed", null);
    } catch (e) {
      await transaction.rollback();
      response(res, false, "Failed", e.message);
    }
  };
};
