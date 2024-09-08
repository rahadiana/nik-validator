
# nik-validator

validasi data NIK disdukcapil kemendagri dan NIK parser
repo ini menghit api disdukcapil kemandagri untuk mengcek NIK.

penggunaan :
  ```ts
    npm i https://github.com/rahadiana/nik-validator
```
   ```ts
    const {ParseNik, ValidateDisduk} = require('@rahadiana/nik-validator')
    const NIK = '3275061707110005'
    
    ValidateDisduk(nik).then(console.log)
    
    ParseNik(nik).then(console.log)
```

 

