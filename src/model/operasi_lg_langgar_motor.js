const Sequelize = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { StructureTimestamp } = require("../constanta/db_structure");
const { AESEncrypt } = require("../lib/encryption");
const Model = Sequelize.Model;

class Operasi_lg_langgar_motor extends Model {}
Operasi_lg_langgar_motor.init(
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
    polres_id: {
      type: Sequelize.INTEGER,
    },
    operasi_id: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATEONLY,
    },
    tanpa_helm: {
      type: Sequelize.INTEGER,
    },
    lawan_arus: {
      type: Sequelize.INTEGER,
    },
    bermain_hp: {
      type: Sequelize.INTEGER,
    },
    pengaruh_alkohol: {
      type: Sequelize.INTEGER,
    },
    max_kecepatan: {
      type: Sequelize.INTEGER,
    },
    dibawah_umur: {
      type: Sequelize.INTEGER,
    },
    lain_lain: {
      type: Sequelize.INTEGER,
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
    tableName: "operasi_lg_langgar_motor",
    modelName: "operasi_lg_langgar_motor",
    sequelize: db,
  }
);

(async () => {
  Operasi_lg_langgar_motor.sync({ alter: true });
})();
module.exports = Operasi_lg_langgar_motor;
