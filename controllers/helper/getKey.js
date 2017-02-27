const pdfFiller = require('pdffiller');
const path = require('path');
const fs = require('fs');
const util = require('util');

const sourcePDF = [
    {
        'url' : 'http://res.cloudinary.com/hmtri/image/upload/v1486695334/golden_west.pdf',
        'name': 'golden_west' 
    },
    {
        'url' : 'http://res.cloudinary.com/hmtri/image/upload/v1487558543/sanfancisco.pdf',
        'name': 'sanfancisco' 
    },
    {
        'url' : 'http://res.cloudinary.com/hmtri/image/upload/v1487558906/barrara.pdf',
        'name': 'barrara' 
    },
    {
        'url' : 'http://res.cloudinary.com/hmtri/image/upload/v1487558619/university_of_science.pdf',
        'name': 'university_of_science' 
    },
    {
        'url' : 'http://res.cloudinary.com/hmtri/image/upload/v1487558828/santiego.pdf',
        'name': 'santiego' 
    }
];

const FDF_data = new Promise((resolve, reject) => {
    pdfFiller.generateFDFTemplate(sourcePDF[0].url, null, function (err, fdfData) {
        if (err) throw err;
        resolve(fdfData);
    })
});

const FDF_data2 = new Promise((resolve, reject) => {
    pdfFiller.generateFDFTemplate(sourcePDF[1].url, null, function (err, fdfData) {
        if (err) throw err;
        resolve(fdfData);
    })
});

const FDF_data3 = new Promise((resolve, reject) => {
    pdfFiller.generateFDFTemplate(sourcePDF[2].url, null, function (err, fdfData) {
        if (err) throw err;
        resolve(fdfData);
    })
});

const FDF_data4 = new Promise((resolve, reject) => {
    pdfFiller.generateFDFTemplate(sourcePDF[3].url, null, function (err, fdfData) {
        if (err) throw err;
        resolve(fdfData);
    })
});

const FDF_data5 = new Promise((resolve, reject) => {
    pdfFiller.generateFDFTemplate(sourcePDF[4].url, null, function (err, fdfData) {
        if (err) throw err;
        resolve(fdfData);
    })
});

Promise.all([FDF_data, FDF_data2, FDF_data3, FDF_data4, FDF_data5]).then(values => {
    let count = 0;
    values.map(value => {
        fs.writeFileSync(path.resolve('key', `./${sourcePDF[count].name}.key.txt`), util.inspect(value), 'utf-8');
        console.log("The file was saved!");
        count++;
    });
});
