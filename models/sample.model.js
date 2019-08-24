
const mongoose = require('mongoose');

const SamSchema = new mongoose.Schema({

UserID : String,
Transcation :[ {
  id: String,
  DNA_Details:[{   
    id: String,
      SampleType : String,
      SampleBuffer: String,
      Organism: String,
      QMethod: String,
      Quantity: String,
      Volume: String,
      '260-280': String,
      '260-230': String,
      audit : { created_at:{ type : Date, default: Date.now } ,updated_at:Date ,created_by:String,updated_by:String}}],
  PooledLibraries_Details:  [
    {
      id: Number,
      LibraryType: String,
      Organism: String,
      SampleType: String,
      LibConfig: String,
      InsertSize: String,
      LibPlexity: String,
      Concentration: String,
      PoolVolume: String,
      RunType:String,
      audit: {
        created_at:{ type : Date, default: Date.now } ,updated_at:Date ,
        created_by: String,
        updated_by: String,
      }
    }
  ]
}]
,
SampleType:{
  type: String,
},
Sample: { 
    SampleType : String,
    SampleName : String,
    Organism : String,
    Description : String,
    IndexId: String,
    IndexTag : String,
    Row: String,
    Coloumn : String,
    CreatedAt : { type : Date, default: Date.now },
    UpdatedAt : { type : Date }
    },
IsDeleted:{ type: Number ,default:0},
CreatedAt:{ type : Date, default: Date.now },
Version:{ type: Number ,default:1},
});


const Sample = mongoose.model('samples', SamSchema);


exports.Sample = Sample; 
