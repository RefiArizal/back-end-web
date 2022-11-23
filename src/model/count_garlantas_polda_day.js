const Sequelize = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { StructureTimestamp } = require("../constanta/db_structure");
const { AESEncrypt } = require("../lib/encryption");
const Model = Sequelize.Model;

class Count_garlantas_polda_day extends Model {}
Count_garlantas_polda_day.init(
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
    pelanggaran_berat: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    pelanggaran_sedang: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    pelanggaran_ringan: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    teguran: {
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
    tableName: "count_garlantas_polda_day",
    modelName: "count_garlantas_polda_day",
    sequelize: db,
  }
);
(async () => {
  Count_garlantas_polda_day.sync({ alter: true });
})();
module.exports = Count_garlantas_polda_day;
