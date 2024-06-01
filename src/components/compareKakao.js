import React, { useState, useEffect } from 'react';

const { kakao } = window;

function CompareKakao({ map, nodeAddr }) {
    const [pathOn, setPathOn] = useState(false);
    const [polyline, setPolyline] = useState(null);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const fetchData = async () => {
        const REST_API_KEY = '7ac167a239af7e3b778713095534cb73';
        const headers = {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json'
        };
        const origin = `${nodeAddr[0].lng},${nodeAddr[0].lat}`;
        const destination = `${nodeAddr[nodeAddr.length - 1].lng},${nodeAddr[nodeAddr.length - 1].lat}`;
        const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}`;
        try {
            const response = await fetch(url, { method: 'GET', headers: headers });
            if (!response.ok) {
                throw new Error(`HTTP 에러!!! Status: ${response.status}`);
            }
            const data = await response.json();
            
            const linePath = data.routes[0].sections[0].roads.reduce((acc, curr) => {
                curr.vertexes.forEach((vertex, index) => {
                    if (index % 2 === 0) {
                        acc.push(new kakao.maps.LatLng(curr.vertexes[index + 1], curr.vertexes[index]));
                    }
                });
                return acc;
            }, []);
            const convertTime = (seconds) => {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                return { hours, minutes };
            };

            const durationInSeconds = data.routes[0].summary.duration;
            const { hours, minutes } = convertTime(durationInSeconds);

            const newPolyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 5,
                strokeColor: '#40A578',
                strokeOpacity: 1.0,
                strokeStyle: 'strokeStyle'
            });

            setPolyline(newPolyline);
            setHours(hours);
            setMinutes(minutes);
        } catch (error) {
            console.error('Error:', error);
            setPolyline(null);
            setHours(1);
            setMinutes(1);
        }
    };

    useEffect(() => {
        if (pathOn) {
            fetchData();
        } else {
            if (polyline) {
                polyline.setMap(null);
            }
            setHours(0);
            setMinutes(0);
        }
    }, [pathOn]); // useEffect to fetch data when pathOn state changes

    useEffect(() => {
        if (pathOn && polyline) {
            polyline.setMap(map);
        }
    }, [polyline]); // useEffect to set polyline map when polyline state changes

    const togglePath = () => {
        setPathOn(!pathOn);
    };

    return (
        <div style={{ position: 'absolute', top: '200px', left: '380px' }}>
            <h4>지도API와 비교</h4>
            <label className="switch">
                <input type="checkbox" checked={pathOn} onChange={togglePath} />
                <span className="slider"></span>
            </label>
            {pathOn && (
                <h4 style={{ position: 'absolute', top: '80px', left: '0px' }}>
                    {hours} 시간 {minutes} 분
                </h4>
            )}
        </div>
    );
}

export default CompareKakao;
