import React, { useState, useEffect } from 'react';
import CompareKakao from '../components/compareKakao';
import MarkerToggle from '../components/MarkerToggle';
const { kakao } = window;

const LeftContainer = ({ nodeAddr, map, eta, totalHours, totalMinutes, start_time }) => {
    const [showRouteDetail, setShowRouteDetail] = useState(false); // State to track visibility

    const toggleRouteDetail = () => {
        setShowRouteDetail(!showRouteDetail); // Toggle visibility
    };
    
    function convert12H(a) { //HH시 MM분 -> 오전/오후 HH시 MM분
        const time = a;
        const getTime = time.substring(0, 2);
        const intTime = parseInt(getTime);
        let str = intTime < 12 ? '오전 ' : '오후 ';
        const cvHour = intTime === 12 ? intTime : intTime % 12;
        return str + ('0' + cvHour).slice(-2) + "시" + time.slice(-4);  
    }

    function check_next_day(ETA, totalHours, totalMinutes) {
        // ETA를 시간과 분으로 분리
        const ETA_hours = parseInt(ETA.substring(0, 2));
        const ETA_minutes = parseInt(ETA.substring(4, 6));
    
        // ETA에서 total 시간과 분을 뺌
        let remaining_hours = ETA_hours - totalHours;
        let remaining_minutes = ETA_minutes - totalMinutes;
    
        // 분을 시간으로 환산하여 시간에 반영
        if (remaining_minutes < 0) {
            remaining_hours -= 1;
            remaining_minutes += 60;
        }
    
        // 결과 반환
        if (remaining_hours < 0) {
            return <h4>다음날</h4>;
        } else {
            return null;
        }
    }
    
    const setCenter = (lat, lng) => {
        if (kakao && map) {
            const moveLatLon = new kakao.maps.LatLng(lat, lng);
            map.setCenter(moveLatLon);
            map.setLevel(8);
        }
    };


    // nodeAddr와 eta가 존재할 때만 렌더링
    if (!nodeAddr || !eta) return null;

    return (
        <div className="LeftContainer">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    {totalHours > 0 && (
                        <h1 style={{ fontSize: "2em", display: "inline" }}>
                            <span style={{ fontSize: "1.7em" }}>{totalHours}</span>시간{" "}
                        </h1>
                    )}
                    {(totalMinutes > 0 || (totalHours === 0 && totalMinutes === 0)) && (
                        <h1 style={{ fontSize: "2em", display: "inline" }}>
                            <span style={{ fontSize: "1.7em" }}>{totalMinutes}</span>분{" "}
                        </h1>
                    )}
                </div>
                <div style={{ height: "60px", borderLeft: "2px solid #ccc", margin: "0 25px" }}></div>
                <div style={{ marginTop: "-30px" }}>
                    {check_next_day(eta, totalHours, totalMinutes)}
                </div>
                
                <div style={{ marginTop: "25px", marginLeft: "10px" }}>
                    <h4>{convert12H(eta)} 도착</h4>
                </div>
            </div>

            <button className="button-6" onClick={toggleRouteDetail}>상세보기</button>
            <CompareKakao map={map} nodeAddr={nodeAddr} />
            <MarkerToggle map={map} nodeAddr={nodeAddr} />
            {showRouteDetail && (
                <div className='RouteDetailComponent'>
                    <h2>경로</h2>
                    <h3>출발시간 : {start_time}</h3>
                    <ul className="ordered-nav">
                        {nodeAddr.map((node, index) => (
                            <li key={index} className="ordered-nav--link" onClick={() => setCenter(node.lat, node.lng)}>
                                <span className="tx-link">{node.name}</span>
                            </li>
                        ))}
                    </ul>
                    <h3>도착시간 : {eta}</h3>
                </div>
            )}
            
        </div>
    );
};

export default LeftContainer;
