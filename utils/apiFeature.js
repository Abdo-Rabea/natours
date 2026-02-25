class APIFeatures {
  constructor(query, queryString) {
    // query is the mongoose query, queryString is the req.query object
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A. filtering
    const queryFilterObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryFilterObject[el]);
    console.log(queryFilterObject);
    // 1B. advanced filtering
    let queryStr = JSON.stringify(queryFilterObject);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort?.replaceAll(',', ' ');
    if (sortBy) {
      this.query = this.query.sort(sortBy); // sort('-price ratingsAverage'); then you have sorting out of the box
    } else {
      this.query = this.query.sort('_id');
    }
    return this;
  }

  limitFields() {
    const fields = this.queryString.fields?.replaceAll(',', ' ');
    if (fields) {
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1; // if page = 0 then 1 return so no error as skip must be >= 0j
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
