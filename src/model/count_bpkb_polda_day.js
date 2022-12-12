const Sequelize = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { StructureTimestamp } = require("../constanta/db_structure");
const { AESEncrypt } = require("../lib/encryption");
const Model = Sequelize.Model;

class Count_bpkb_polda_day extends Model {}
Count_bpkb_polda_day.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      get() {
        return AESEncrypt(String(this.getDataValue("id")), {
          isSafeUrl: true,
        });
      },
    },
    polda_id: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATEONLY,
    },
    baru: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    perpanjangan: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    rubentina: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    bbn_1: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    bbn_2: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    mutasi_masuk: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    mutasi_keluar: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    perubahan_pergantian: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ...StructureTimestamp,
  },
  {
    defaultScope: {
      where: {
        deleted_at: null,
      },
    },
    scopes: {
      deleted: {
        where: {
          deleted_at: null,
        },
      },
    },
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "count_bpkb_polda_day",
    modelName: "count_bpkb_polda_day",
    sequelize: db,
  }
);
(async () => {
  Count_bpkb_polda_day.sync({ alter: true });
})();
module.exports = Count_bpkb_polda_day;
