const mongoose = require('mongoose');
const Submission = require("./submission");
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linkedList','graph','dp'],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    templates: [
  {
    language: {
      type: String,
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    driverCode: {
      type: String,
      required: true,
    },
    explanation: {
    type: String,
    default: ""
}
  }
],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})


problemSchema.pre("findOneAndDelete", async function (next) {
  try {
    console.log("Problem delete middleware");

    const problem = await this.model.findOne(this.getFilter());

    console.log("Problem:", problem?._id);

    if (problem) {
      const result = await Submission.deleteMany({
        problemId: problem._id,
      });

      console.log("Deleted submissions:", result.deletedCount);
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});
const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;


