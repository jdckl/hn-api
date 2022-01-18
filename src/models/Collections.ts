import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../middlewares/database';

import Story from './Stories';

/**
 * Story collection model definition
*/

// Attributes
interface CollectionAttributes {
    id: number;
    name: string;
    ownerId: number;
}

// ID is optional for insert
interface CollectionCreationAttributes 
    extends Optional<CollectionAttributes, 'id'> {}

// Update/Create times
interface CollectionInstance 
    extends Model<CollectionAttributes, CollectionCreationAttributes>,
        CollectionAttributes {
            createdAt?: Date;
            updatedAt?: Date;
        }

// Definition
const Collection = connection.define<CollectionInstance>(
    'collection',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        ownerId: {
            allowNull: false,
            type: DataTypes.UUID
        }
    }
)

// One-many relation for stories
Collection.hasMany(Story, {
    sourceKey: 'id',
    foreignKey: 'collectionId',
    as: 'stories'
})

// One-one for story
Story.belongsTo(Collection, {
    foreignKey: 'collectionId',
    as: 'collection'
})

export default Collection;