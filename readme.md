# 문화재 데이터 가져오기 프로젝트

## 사전 요구사항

### tsc 및 tsc-watch 설치

```shell
$ npm install -g tsc tsc-watch
# 필요시 sudo 포함하여 명령
```

## .env 파일

### ~/heritage.ts 파일의 경우 환경변수가 있음

```javascript
const LIMIT: number = process.env.LIMIT ? Number(process.env.LIMIT) : 10;
const TOTAL_PAGE: number = process.env.TOTAL_PAGE
    ? Number(process.env.TOTAL_PAGE)
    : 5;
```

#### 기본적으로 위와 같이 되어 있으나, 환경변수를 바꾸고자 할 경우,

#### ~/.env 파일을 생성 후 아래와 같이 적절히 설정

```
LIMIT=10
TOTAL_PAGE=5
```

#### 다만 LIMIT와 TOTAL_PAGE가 너무 크면 문화재청 API에 무리가 가기 때문에 적절히 설정할 것

## 실행

```shell
$ npm run start
```

## 결과

### ~/data/list.json

### ~/data/detailList.json

### ~/data/imageList.json

### ~/data/videoList.json

### ~/data/table/\*.json
