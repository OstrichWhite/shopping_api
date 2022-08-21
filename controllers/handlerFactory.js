
exports.getAll = (Model) =>{
  return async (req, res) => {
    try{
      const doc = await Model.find();
      // const doc = await Model.find({delstatus: {$ne: 1}});
  
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
      
    }catch(err){
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    }
  };
}

exports.getOne = (Model) =>{
  return async (req, res) => {
    try{
      const doc = await Model.findById(req.params.id);
      
      if (!doc) {
        return res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID',
        })
      }
      res.status(200).json({ status: 'success', data: { data: doc } });
      
    }catch(err){
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    }
  };
}

exports.createOne = (Model) =>{
  return async (req, res) => {
    try{
      const doc = await Model.create(req.body);
      res.status(201).json({ status: 'success', data: { data: doc } });
    }catch(err){
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    }
  };    
}

exports.updateOne = (Model) =>{
  return async (req, res) => {
    try{
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).exec();
      if (!doc) {
        return res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID',
        })
      }
      res.status(200).json({
        status: 'success',
        data: { data: doc },
      });
      
    }catch(err){
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    }
  };
}

exports.deleteOne = (Model) =>{
  return async (req, res) => {
    try{
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID',
        })
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }catch(err){
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    }  
  }
}

exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};