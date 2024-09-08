'use strict';

const {RawResponseHandler} = require('@rahadiana/node_response_standard')
const {nikParser} = require('@rahadiana/nik-parser')
const https = require('https');
const crypto = require('crypto');

function randomAlphanumeric(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
    }
    return result;
}

function randomNumeric(length) {
    let result = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += (bytes[i] % 10).toString();
    }

    return result;
}

function ParseNik(nik) {
    return new Promise((resolve, reject) => {
        const Parse = nikParser(`${nik}`)

        if (Parse.isValid() == true) {
            const Resuts = {
                nik:nik,
                provinceId: Parse.provinceId(),
                province: Parse.province(),
                kabupatenKotaId: Parse.kabupatenKotaId(),
                kabupatenKota: Parse.kabupatenKota(),
                kecamatanId: Parse.kecamatanId(),
                kecamatan: Parse.kecamatan(),
                kodepos: Parse.kodepos(),
                kelamin: Parse.kelamin(),
                lahir: Parse.lahir(),
                uniqcode: Parse.uniqcode()
            }
            return resolve(RawResponseHandler(200, Resuts, 'sucess'))
        } else {
            return resolve(RawResponseHandler(400, '', 'failed parse NIK'))
        }
    });
}

function ValidateDisduk(NIK) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(
            {NIK: NIK, EMAIL: `${randomAlphanumeric(5)}@gmail.com`, PHONE_NUMBER: `08${randomNumeric(8)}`, DEVICE_ID: `${randomAlphanumeric(3)}_${randomAlphanumeric(9)}`}
        );

        const options = {
            hostname: 'mobile.dukcapil.kemendagri.go.id',
            port: 443,
            path: '/auth/pendudukMobile/registrasi',
            method: 'POST',
            headers: {
                'User-Agent': 'Dart/2.13 (dart:io)',
                'Content-Type': 'application/json',
                'Transfer-Encoding': 'chunked',
                'Host': 'mobile.dukcapil.kemendagri.go.id'
            },
            timeout: 9000
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {

                const FinalDataNIK = data.toString();

                resolve(
                    FinalDataNIK.includes('tidak ditemukan')
                        ? {
                            status: 404,
                            nik: NIK,
                            message:FinalDataNIK
                        }
                        : res.statusCode == 200 || FinalDataNIK.includes('berumur')
                            ? {
                                status: 200,
                                nik: NIK,
                                message:FinalDataNIK
                            }
                            : {
                                status: 500,
                                nik: NIK,
                                message:FinalDataNIK
                            }
                );
            });
        });

        req.on('error', (e) => {
            resolve({status: 500, nik: NIK, message:e });
        });

        req.on('timeout', () => {
            resolve({status: 408, nik: NIK,message:'timeout'});
            req.destroy();
        });

        req.write(jsonData);

        req.end();
    });
}

module.exports = {
    ParseNik,
    ValidateDisduk
}
