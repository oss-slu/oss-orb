# Scripts for developers
## Backend
- ### Download UC OSPO parquet file locally
    - */api/src/scripts/localParquet.ts*
    ```
    # (from project root)
    cd api
    npx tsx src/scripts/localParquet.ts
    ```
    - Creates /api/data directory and downloads the parquet file from the public UC USPO S3 buckets

- ### create a new type with the columns in the parquet file 
    - */api/src/scripts/parquetColsToType.ts*
    ```
    # (from project root)
    cd api
    npx tsx src/scripts/parquetColsToType.ts >> src/types/parquetData.ts
    ```
- ### convert parquet data to array of parquetData types, save as json in api/data/sample
    - */api/src/scripts/parqToObjs.ts*
    ```
    # (from project root)
    cd api
    npx tsx src/scripts/parqToObjs.ts
    ```
