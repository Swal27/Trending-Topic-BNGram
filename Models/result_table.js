import sequelizes from "../config/db_config.js";
import { Model, DataTypes } from "sequelize";

class result_table extends Model { }
result_table.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    bigram: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    df: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dfidf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    boost: {
        type: DataTypes.STRING,
        allowNull: false
    },
    previos_bigram: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ttimeslot: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelizes,
    modelName: 'result_table',
});

sequelizes.sync().then(() => {
    console.log("Create result_table Success");
}).catch((error) => {
    console.error('Unable to create result_table: ', error);
});

export default result_table;


