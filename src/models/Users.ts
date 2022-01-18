import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../middlewares/database';
import Collection from './Collections';

/**
 * User model definition
*/

// Attributes
interface UsersAttributes {
    id: number;
    email: string;
    password: string;
}

// ID is optional for insert
interface UsersCreationAttributes 
    extends Optional<UsersAttributes, 'id'> {}

// Update/Create times
interface UserInstance 
    extends Model<UsersAttributes, UsersCreationAttributes>,
        UsersAttributes {
            createdAt?: Date;
            updatedAt?: Date;
        }

// Define
const User = connection.define<UserInstance>(
    'user',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true
        },
        email: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        password: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }
)

// One-many relation
User.hasMany(Collection, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'collections'
})

// One-one for user
Collection.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'user'
})

export default User;