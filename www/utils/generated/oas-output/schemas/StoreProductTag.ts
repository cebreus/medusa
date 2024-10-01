/**
 * @schema StoreProductTag
 * type: object
 * description: The tag's details.
 * x-schemaName: StoreProductTag
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The tag's ID.
 *   value:
 *     type: string
 *     title: value
 *     description: The tag's value.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the tag was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the tag was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the tag was deleted.
 *   metadata:
 *     type: object
 *     description: The tag's metadata, can hold custom key-value pairs.
 * required:
 *   - id
 *   - value
 *   - created_at
 *   - updated_at
 * 
*/
