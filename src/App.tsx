import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Geolocation } from "@capacitor/geolocation";
import "./App.css";

const App: React.FC = () => {
  const [celsius, setCelsius] = useState<string>("");
  const [fahrenheit, setFahrenheit] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // Chuyển đổi nhiệt độ
  const convertTemperature = () => {
    if (celsius === "") {
      alert("Vui lòng nhập nhiệt độ!");
      return;
    }
    const tempF = (parseFloat(celsius) * 9) / 5 + 32;
    const result = tempF.toFixed(2);
    setFahrenheit(result);

    sendNotification(result);
  };

  // Gửi thông báo
  const sendNotification = async (temp: string) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Chuyển đổi thành công",
          body: `Nhiệt độ: ${celsius}°C = ${temp}°F`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  };

  // Chia sẻ kết quả
  const shareResult = async () => {
    if (!fahrenheit) return;
    await Share.share({
      title: "Kết quả chuyển đổi",
      text: `Nhiệt độ: ${celsius}°C = ${fahrenheit}°F`,
      dialogTitle: "Chia sẻ kết quả",
    });
  };

  // Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const coords = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
      setLocation(coords);
    } catch (error) {
      setLocation("Không thể lấy vị trí.");
    }
  };

  return (
    <div className="container">
      <h1>Chuyển đổi nhiệt độ</h1>
      <input
        type="number"
        placeholder="Nhập nhiệt độ (°C)"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      <button onClick={convertTemperature}>Chuyển đổi</button>

      {fahrenheit && <p>Kết quả: {fahrenheit}°F</p>}

      <button onClick={shareResult}>Chia sẻ kết quả</button>
      <button onClick={getCurrentLocation}>Lấy vị trí</button>

      {location && <p>Vị trí hiện tại: {location}</p>}
    </div>
  );
};

export default App;
