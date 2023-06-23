const express = require("express");
const router = express.Router();
const reclamation = require("../models/reclamation") ;
const Type = require("../models/type")


const { MongoClient ,ObjectId  } = require('mongodb');

   /*********************************************Get all recalamtions */

   router.get("/allreclamation",async(req,res)=>{
    try{
        const ajouter= await reclamation.find();
        res.send(ajouter);
    }catch(err){res.json({message:err})}
    })
   

/**************************End of the FUN */
    

      /********************************************Move and deleted */

      router.post('/moveData/:id', async (req, res) => {
        const sourceCollectionName = 'reclamations';
        const targetCollectionName = 'Delete';
      
        const documentId = req.params.id;
      
        // Connect to MongoDB
        const client = new MongoClient('mongodb://127.0.0.1:27017', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      
        try {
          // Connect to the MongoDB server
          await client.connect();
      
          // Get the database object
          const db = client.db('reclamation');
      
          // Get the source and target collections
          const sourceCollection = db.collection(sourceCollectionName);
          const targetCollection = db.collection(targetCollectionName);
      
          // Find the document in the source collection by ID
          const document = await sourceCollection.findOne({ _id: new ObjectId(documentId) });
      
          if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
          }
      
          // Move the document to the target collection
          await targetCollection.insertOne(document);
      
          // Remove the document from the source collection
          await sourceCollection.deleteOne({ _id: new ObjectId(documentId) });
      
          res.json({ message: 'Document moved successfully.' });
        } catch (error) {
          console.error('Error moving document:', error);
          res.status(500).json({ error: 'An error occurred while moving the document.' });
        } finally {
          // Close the MongoDB connection
          await client.close();
        }
      });
/***************************************End of the FUN */



///////////*************************Send recalamation ********************///////////
router.post("/reclamer", async (req, res) => {
  const { type, titre, Description, fileData, status } = req.body;

  try {
    // Perform the join with the "Types" collection
    const joinedType = await Type.findOne({ type: type });

    if (!joinedType) {
      return res.status(404).json({ message: "Type not found." });
    }

    const reclamations = new reclamation({
      type: joinedType,
      titre,
      Description,
      fileData,
      status: status || false,
    });

    const savedReclamation = await reclamations.save();
    res.status(201).json(savedReclamation);
  } catch (error) {
    console.error("Error creating reclamation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///////////*************************End send recalamation ********************///////////


//////////////////////********update***********////////////////
router.patch("/update/:id", async (req, res) => {
  try {
    const { titre, Description, fileData } = req.body;

    const updatedOperateur = await reclamation.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          titre,
          Description,
          fileData,
        },
      },
      { new: true }
    );

    res.send(updatedOperateur);
    console.log(updatedOperateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/////////////End update///////////////////////////







    
    

 
module.exports=router;