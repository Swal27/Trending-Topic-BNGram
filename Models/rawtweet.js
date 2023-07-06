import sequelizes from "../config/db_config.js";
import { Model, DataTypes } from "sequelize";

class rawtweet extends Model { }
rawtweet.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text_raw: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text_process: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time_slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: sequelizes,
    modelName: 'rawtweet',
});

sequelizes.sync().then(() => {
    console.log("Create rawtweet Success");
}).catch((error) => {
    console.error('Unable to create rawtweet: ', error);
});

export default rawtweet;


