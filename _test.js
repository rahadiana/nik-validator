'use strict';
const {ParseNik, ValidateDisduk} = require('./index')

async function Test(nik) {
    const ValidateDisduks = await ValidateDisduk(nik)
    const ParseNiks = await ParseNik(nik)
    console.log({validateDisduk: ValidateDisduks, validateParseNIK: ParseNiks})
}

Test('3275061707110005')