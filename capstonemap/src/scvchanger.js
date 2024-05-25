
import React, { useState } from 'react';
import { useMap } from './MapContext';

const { kakao } = window;

const scvchanger = () => {
    const { map, setMap } = useMap();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [markers, setMarkers] = useState([]);

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = () => {
        keywordSearch(keyword);
    };

    const keywordSearch = (keyword) => {
        var places = new kakao.maps.services.Places();

        var searchCallback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setSearchResults(result.slice(0, 3)); // 앞에서부터 3개의 결과만 선택
                setMarkers([]); // 새로운 검색을 위해 기존의 마커 제거
                result.slice(0, 3).forEach((item) => {
                    const latlng = new kakao.maps.LatLng(item.y, item.x);
                    const marker = new kakao.maps.Marker({
                        name: item.place_name,
                        position: latlng,
                        map: map
                    });
                    setMarkers((prevMarkers) => [...prevMarkers, marker]);
                });
            }
        };

        places.keywordSearch(keyword, searchCallback);
    };

    return (
        <div>
            <input 
                type="text"
                value={keyword}
                onChange={handleInputChange}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={handleSearch}>제출</button>

            {/* 결과를 보여주는 부분 */}
            <ul>
                {searchResults.map((result, index) => (
                    <li key={index}>
                        <p>이름: {result.place_name}</p>
                        <p>카테고리: {result.category_name}</p>
                        <p>x: {result.x}</p>
                        <p>y: {result.y}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default scvchanger;
