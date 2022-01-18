/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Users
    pgm.createTable('users', {
        id: 'id',
        email: {
            type: 'varchar(300)',
            notNull: true
        },
        password: {
            type: 'text',
            notNull: true
        },
        createdAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        },
        updatedAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        }
    })

    // Collections
    pgm.createTable('collections', {
        id: 'id',
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        ownerId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        },
        updatedAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        }
    })
    pgm.createIndex('collections', 'ownerId');

    // Stories
    pgm.createTable('stories', {
        id: 'id',
        itemId: {
            type: 'integer',
            notNull: true
        },
        collectionId: {
            type: 'integer',
            notNull: true,
            references: '"collections"',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(255)',
            notNull: true
        },
        text: {
            type: 'text',
            notNull: true
        },
        url: {
            type: 'varchar(500)',
            notNull: true
        },
        createdAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        },
        updatedAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        }
    })
    pgm.createIndex('stories', 'collectionId');
    pgm.createIndex('stories', 'itemId');

    // Stories
    pgm.createTable('comments', {
        id: 'id',
        itemId: {
            type: 'integer',
            notNull: true
        },
        storyId: {
            type: 'integer',
            notNull: true,
            references: '"stories"',
            onDelete: 'cascade',
        },
        author: {
            type: 'varchar(255)',
            notNull: true
        },
        text: {
            type: 'text',
            notNull: true
        },
        commentedOn: {
            type: 'timestamp',
            notNull: true
        },
        createdAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        },
        updatedAt: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp')
        }
    })
    pgm.createIndex('comments', 'storyId');
    pgm.createIndex('comments', 'itemId');
};

exports.down = pgm => {
    pgm.dropTable('users', {cascade: true})
    pgm.dropTable('collections', {cascade: true})
    pgm.dropTable('stories', {cascade: true})
    pgm.dropTable('comments', {cascade: true})
};
