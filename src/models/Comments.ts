import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../middlewares/database';

/**
 * Story collection model definition
*/

// Attributes
interface CommentsAttributes {
    id: number;
    itemId: number;
    storyId: number;
    author: string;
    text: string;
    commentedOn: string;
}

// ID is optional for insert
interface CommentsCreationAttributes 
    extends Optional<CommentsAttributes, 'id'> {}

// Update/Create times
interface CommentInstance 
    extends Model<CommentsAttributes, CommentsCreationAttributes>,
        CommentsAttributes {
            createdAt?: Date;
            updatedAt?: Date;
        }

// Definition
const Comment = connection.define<CommentInstance>(
    'comment',
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
        storyId: {
            allowNull: false,
            autoIncrement: false,
            type: DataTypes.UUID
        },
        author: {
            allowNull: false,
            type: DataTypes.STRING
        },
        text: {
            allowNull: false,
            type: DataTypes.TEXT('long')
        },
        commentedOn: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }
)

export default Comment;