import React, { useState } from 'react';
import axios from 'axios'; // 추가
import pandas from 'pandas'; // 추가

const scvchanger = () => {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = () => {
        keywordSearch(keyword);
    };

    const keywordSearch = (keyword) => {
        axios.get(`YOUR_BACKEND_URL/search?keyword=${keyword}`) // 수정: 서버에서 검색 결과를 받아옴
            .then(response => {
                const result = response.data;
                setSearchResults(result);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
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
