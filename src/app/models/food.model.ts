export interface Category {
  _id: String,
  name: String
}

export interface Food {
  _id: String,
  name: String,
  category: Category
}
