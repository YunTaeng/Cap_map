import React, { useState, useEffect } from 'react';
import img from '../images/marker.png';
const { kakao } = window;

function MarkerToggle({ map, nodeAddr }) {
    const [markersOn, setMarkersOn] = useState(false);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (markersOn && map && nodeAddr.length > 0) {
            const createdMarkers = createMarkers(map, nodeAddr);
            setMarkers(createdMarkers);
        } else {
            markers.forEach(marker => marker.setMap(null));
            setMarkers([]);
        }
    }, [markersOn, map, nodeAddr]);

    const createMarkers = (map, nodeAddr) => {
        const firstMarker = nodeAddr[0];
        const lastMarker = nodeAddr[nodeAddr.length - 1];

        return nodeAddr.map((coord, index) => {
            const lat = parseFloat(coord.lat);
            const lng = parseFloat(coord.lng);

            // 별도의 마커 설정
            const imageSrc = img; // 마커 이미지의 주소입니다    
            const imageSize = new kakao.maps.Size(20, 20);
            const imageOption = { offset: new kakao.maps.Point(10, 15) };

            // 첫 번째와 마지막 마커에만 이미지 적용
            let markerImage = null;
            if (coord !== firstMarker && coord !== lastMarker) {
                markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
            }

            // 마커 생성
            const marker = new kakao.maps.Marker({
                name: coord.name,
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                image: markerImage
            });

            // 커스텀 오버레이의 내용
            const content = `<div class="customoverlay">
                                <span class="title">${coord.name}</span>
                            </div>`;

            const customOverlay = new kakao.maps.CustomOverlay({
                position: new kakao.maps.LatLng(lat, lng),
                content: content,
                yAnchor: 0,
            });

            // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                customOverlay.setMap(map);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                customOverlay.setMap(null);   
            });

            return marker;
        });
    };

    const toggleMarkers = () => {
        setMarkersOn(!markersOn);
    };

    return (
        <div style={{ position: 'absolute', top: '350px', left: '380px' }}>
            <h3>Marker 토글</h3>
            <label className="switch">
                <input type="checkbox" checked={markersOn} onChange={toggleMarkers} />
                <span className="slider"></span>
            </label>
        </div>
    );
}

export default MarkerToggle;
