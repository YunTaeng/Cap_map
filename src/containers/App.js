import React, { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import LeftContainer from './LeftContainer';
import Autocomplete from '../components/autocomplete';
import logo from '../images/Logo.svg';
import axios from 'axios';
import './App.css';
import './LeftContainer.css'
import './loading.css'


const App = () => {
    const getCurrentTime = () => { //한국의 현재 시간 받아오기
        const now = new Date();
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstTime = new Date(now.getTime() + kstOffset);
        return kstTime.toISOString().substring(11, 16);
    };

    const [start_point, setStartPoint] = useState('');
    const [end_point, setEndPoint] = useState('');
    const [start_time, setStartTime] = useState(getCurrentTime());
    const [nodeAddr, setNodeAddr] = useState([]);
    const [eta, setEta] = useState('');
    const [totalHours, setTotalHours] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [map, setMap] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [loading, setLoading] = useState(false);
    /*-----------------------------------*/
    // const { kakao } = window;
    // var places = new kakao.maps.services.Places();
    //     const nodeName=['기장JC']
    
        
    //     var keywordresult = []; // 결과를 저장할 배열

    //     nodeName.forEach(function(keyword, index) {
    //         var searchCallback = function(keyword, index) {
    //             return function(result, status) {
    //                 if (status === kakao.maps.services.Status.OK) { // 결과를 배열에 추가
    //                     keywordresult[index] = {
    //                         name : result[0].place_name,
    //                         lat: result[0].y,
    //                         lng: result[0].x
    //                     };
    //                     keywordresult[index+1] = {
    //                         name : result[1].place_name,
    //                         lat: result[1].y,
    //                         lng: result[1].x
    //                     };
    //                     keywordresult[index+2] = {
    //                         name : result[2].place_name,
    //                         lat: result[2].y,
    //                         lng: result[2].x
    //                     };
    //         }
    //         };
    //     }(keyword, index);
    //     places.keywordSearch(keyword, searchCallback);
    //     });
    //     console.log(keywordresult)
/*-----------------------------------*/
    const handleSearch = () => {  
        if (start_point === end_point) {//출-도착지가 같을 경우
            setErrorMessage('출발지와 목적지를 다르게 설정하세요');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }

        if (start_point && end_point&&start_time) {
            setLoading(true);
            const reqTime = new Date(); // 시작시각 기록
        /*------------------------------------------------------------*/
            // axios.post('http://34.47.71.145:5000/find_path', {start_point, end_point, start_time})
            // .then(response => {
            //     const resTime = new Date(); // 끝시간 기록
            //     const timeDiff = resTime - reqTime; //
            //     console.log(`경과한 시간: ${timeDiff} ms`);
            //     const { path, total_hours, total_minutes, total_seconds,eta } = response.data;
            //     setEta(eta);
            //     setTotalHours(total_hours);
            //     setTotalMinutes(total_minutes);
            //     setTotalSeconds(total_seconds);

            //     return axios.post('http://34.47.71.145:5000/get-node-info', { nodeNames: path })
            // })
        /*--------------------------------------------------------------*/
            const { path, total_hours, total_minutes, total_seconds,eta } = {'path': ['서울특별시청', '한남IC', '잠원IC', '반포IC', '서초IC', '양재IC', '금토JC', '대왕판교IC', '판교JC', '판교IC', '서울TG', '신갈JC', '마성IC', '서용인JC', '용인IC', '양지IC', '덕평IC', '호법JC', '이천IC', '여주JC', '감곡IC', '충주JC', '북충주IC', '중앙탑Hi', '충주IC', '괴산IC', '연풍IC', '문경새재IC', '점촌함창IC', '북상주IC', '상주IC', '낙동JC', '상주JC', '도개IC', '서군위IC', '군위JCT', '동군위IC', '신녕IC', '화산JCT', '동영천IC', '북안IC', '영천JC', '건천IC', '경주IC', '활천IC', '언양JC', '울산JCT', '문수IC', '울주JC', '청량IC', '온양IC', '장안IC', '기장IC', '해운대IC', '동부산IC', '부산광역시청'], 'total_hours': 4, 'total_minutes': 44, 'total_seconds': 0, 'eta': '16시 44분'}
            setEta(eta);
            setTotalHours(total_hours);
            setTotalMinutes(total_minutes);
            setTotalSeconds(total_seconds);
            axios.post('http://34.47.71.145:5000/get-node-info', { nodeNames: path })
        /*--------------------------------------------------------------*/

            .then(response => {
                setNodeAddr(response.data);
                setMapKey(prevKey => prevKey + 1);
            })
            .catch(error => {
                console.error('Error fetching route info:', error);
                console.log('Loading stopped due to error');
            }).finally(() => {
                setLoading(false); // Hide loading spinner
            });
        } else {
            setErrorMessage('전부 입력하고 검색을 눌러주세요');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000); // 3초 후 에러메세지 사라짐
        }
    };
    const handleLogoClick = () => {
        window.location.reload(); // 페이지 새로고침
    };
    useEffect(() => {
        setStartTime(getCurrentTime());
    }, []);
    
    return (
        <div className="App">
            {loading && (
            <div className="loading-wrap">
                <div className="loading-spinner"></div>
                <p>페이지가 로딩 중입니다...</p>
            </div>
            )}
            <div className="LandingPage">
                <div className="Header">
                        <img src={logo} alt="로고" className="Logo" onClick={handleLogoClick}/>
                </div>
                <div className="SearchBox">
                    <Autocomplete
                        placeholder="출발지 입력"
                        onSelectOption={(option) => setStartPoint(option)}
                        inputValue={start_point}
                        setInputValue={setStartPoint}
                    />
                    <Autocomplete
                        placeholder="도착지 입력"
                        onSelectOption={(option) => setEndPoint(option)}
                        inputValue={end_point}
                        setInputValue={setEndPoint}
                    />
                    <label htmlFor="appt-time">출발 시간 입력 :</label>
                    <input
                        id="appt-time"
                        type="time"
                        value={start_time}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <button className="button-74" onClick={handleSearch}>검색</button>
                    {showError && <div className="ErrorMessage">{errorMessage}</div>}
                </div>
                <LeftContainer 
                    nodeAddr={nodeAddr}
                    map={map} 
                    eta={eta} 
                    totalHours={totalHours} 
                    totalMinutes={totalMinutes}
                    start_time={start_time}
                />
                <MapContainer key={mapKey} setMap={setMap} nodeAddr={nodeAddr} />
            </div>
        </div>
    );
};

export default App;
