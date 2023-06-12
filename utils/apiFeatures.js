class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query, queryObj);

    // 2) Advanced filtering, allows greater than, less than etc
    let queryStr = JSON.stringify(queryObj);
    // The $ sign is lost so we need to impose it with match, gte{greater or equal} gt{greater than}, lte{less than or equal}
    // \b matches specific word, /g replaces all occurrences
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    //let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 3) sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //5) Pagination
    // page=2&limit=10, 1-10|page 1, 11-20|page 2,
    // skip _ elements inorder to display requested page elements
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // here skip all the previous results behind the requested page
    //e.g Req Page 3, page3-1=2*limit
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;

    // checks whether requested pages exist
    //if (this.queryString.page) {
    //const numTours = await Tour.countDocuments();
    //if (skip >= numTours) throw new Error('This page does not exist');
    //}
  }
}

module.exports = APIFeatures;
