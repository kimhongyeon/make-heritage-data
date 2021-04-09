// 문화재 목록 테이블
const Heritages = {
    id,
    name,
    nameChin,
    isLive,
    longitude,
    latitude,
    quantity,
    registDate,
    address,
    content,
    largeRegion_id,
    smallRegion_id,
    image_id,
    age_id,
    admin_id,
    owner_id,
    aType_id,
    bType_id,
    cType_id,
    dType_id,
};

const HeritageImages = {
    id,
    heritage_id,
    image_id,
};

const HeritageMovies = {
    id,
    heritage_id,
    movie_id,
};

// 종목 테이블
const Classes = {
    id,
    name,
};

// 종목별 지정번호 테이블
const ClassNumbers = {
    id,
    class_id,
    heritage_id,
    number,
};

const Entities = {
    id,
    name,
};

const Admins = {
    id,
    entity_id,
};

const Owners = {
    id,
    entity_id,
};

// 이미지 테이블
const Images = {
    id,
    title,
    url,
};

// 동영상 테이블
const Movies = {
    id,
    url,
};

// 시대 테이블
const Ages = {
    id,
    name,
};

const ATypes = {
    id,
    name,
};

const BTypes = {
    id,
    aType_id,
    name,
};

const CTypes = {
    id,
    bType_id,
    name,
};

const DTypes = {
    id,
    cType_id,
    name,
};

// 시도 테이블
const LargeRegions = {
    id,
    name,
};

// 시군구 테이블
const SmallRegions = {
    id,
    name,
};
