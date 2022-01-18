import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../middlewares/database';

import Comment from './Comments';

/**
 * Stories (hn items) model definition
*/

// Attributes
interface StoriesAttributes {
    id: string;
    itemId: number;
    collectionId: string;
    title: string;
    text: string;
    url: string;
}

// ID is optional for insert
interface StoriesCreationAttributes 
    extends Optional<StoriesAttributes, 'id'> {}

// Update/Create times
interface StoryInstance 
    extends Model<StoriesAttributes, StoriesCreationAttributes>,
        StoriesAttributes {
            createdAt?: Date;
            updatedAt?: Date;
        }

// Define
const Story = connection.define<StoryInstance>(
    'story',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true
        },
        itemId: {
            allowNull: false,
            type: DataTypes.MEDIUMINT
        },
        collectionId: {
            allowNull: false,
            autoIncrement: false,
            type: DataTypes.UUID
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        text: {
            allowNull: true,
            type: DataTypes.TEXT('long')
        },
        url: {
            allowNull: false,
            type: DataTypes.STRING(500)
        }
    }
)

// One-many relation for stories
Story.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'storyId',
    as: 'stories'
})

// One-one for story
Comment.belongsTo(Story, {
    foreignKey: 'storyId',
    as: 'comment'
})

export default Story;