const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')
const parse = require("csv-parse");
const csvFile = "metering_data.csv";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json({limit:52428800}));
app.use(bodyParser.urlencoded({ extended: false, limit: 52428800}));

//rms model
class Rms {
    constructor(Serial, ReadingDateTimeUTC, WH, VARH) {
      this.Serial = Serial;
      this.ReadingDateTimeUTC = ReadingDateTimeUTC;
      this.WH = WH;
      this.VARH = VARH;     
    }
}


// API routes
app.get('/', (req,res) => {
    const processData = (err, data) => {
        if (err) {
            res.json(`An error was encountered: ${err}`);
            return;
        }
    
        data.shift(); // only required if csv has heading row
        const rmsList = data.map(row => new Rms(...row));
        analyseUsers(rmsList);
    }
    
    fs.createReadStream(csvFile)
      .pipe(parse({ delimiter: ',' }, processData));

    const analyseUsers = rmsList => {
        res.json(rmsList);
    }

});

// Get rms by serial number
app.get('/:Serial', (req,res) => {

    //Processing data
    const processData = (err, data) => {
        if (err) {
            res.json(`An error was encountered: ${err}`);
            return;
        }
    
        data.shift(); // only required if csv has heading row  
        const rmsList = data.map(row => new Rms(...row));
        
        // Calling 
        analysRms(rmsList);
    }
    
    fs.createReadStream(csvFile)
      .pipe(parse({ delimiter: ',' }, processData));

    const analysRms = rmsList => {
        const data =rmsList.filter(a => a.Serial == req.params.Serial);
        res.json(data);
    }

});

app.listen(PORT, () => {
    console.log(`Searver is running on port ${PORT}. visit http://localhost:${PORT}/`);
})