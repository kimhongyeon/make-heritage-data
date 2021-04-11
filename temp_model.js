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
    class_id,
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

const Admins = {
    id,
    entity_id,
};

const Owners = {
    id,
    entity_id,
};

// 시대 테이블
const Ages = {
    id,
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
