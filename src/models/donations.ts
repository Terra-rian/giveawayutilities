import { STRING, BIGINT, Model } from 'sequelize';
import { sequelize } from '../assets/sequelize';
import { DonationAttributes } from '../typings/sequelize';

export const donations = sequelize.define<Model<DonationAttributes>>('donations', {
    user_id: {
        type: STRING,
        primaryKey: true,
        allowNull: false,
    },
    donations: {
        type: BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    timestamps: true,
});