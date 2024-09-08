import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function Slider() {
  const [value, setValue] = useState(50);
  const [points, setPoints] = useState(100);
  const [deposit, setDeposit] = useState(points);
  const [num, setNum] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(''); // State for error messages
  const sliderRef = useRef(null);

  useEffect(() => {
    if (num !== null && result !== null) {
      console.log('Random Number:', num, 'Slider Value:', value.toFixed(2), 'Result:', result);
    }
  }, [num, result]);

  const handleMouseDown = (e) => {
    moveSlider(e);

    const handleMouseMove = (e) => {
      moveSlider(e);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const moveSlider = (e) => {
    const slider = sliderRef.current;
    const sliderWidth = slider.offsetWidth;
    const sliderLeft = slider.getBoundingClientRect().left;

    let newValue = ((e.clientX - sliderLeft) / sliderWidth) * 100;

    newValue = Math.min(Math.max(newValue, 0.01), 95);

    setValue(newValue);
  };

  const calculateCoefficient = (chance) => {
    return (95.5 / chance);
  };

  const coefficient = calculateCoefficient(value);

  const handlePointsChange = (e) => {
    const newPoints = e.target.value;
    if (newPoints >= 0) {
      setDeposit(newPoints);
    }
  };

  const getRandomNumber = () => {
    const min = 0;
    const max = 100;
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  const startGame = () => {
    // Check if deposit is greater than points
    if (deposit > points) {
      setError('Недостаточно поинтов на балансе'); // Set error message
      return; // Exit the function early if not enough points
    }

    // Clear the error message if points are sufficient
    setError('');

    const randomNumber = getRandomNumber();
    const gameResult = parseFloat(value.toFixed(2)) >= parseFloat(randomNumber);

    console.log('Random Number:', randomNumber, 'Slider Value:', value.toFixed(2), 'Result:', gameResult);

    setNum(randomNumber);
    setResult(gameResult);

    if (gameResult) {
      setPoints((prevPoints) => (prevPoints - deposit) + (deposit * coefficient.toFixed(2)));
    } else {
      setPoints((prevPoints) => prevPoints - deposit);
    }
  };

  return (
    <div>
      <div className="header">{points}$</div>
      <div className="slider-container">
        <div className="slider-info">
          <div>Коэффициент: {coefficient.toFixed(2)}</div>
          <div>Интервал: {value.toFixed(2)}</div>
          <div>Шанс {value.toFixed(2)}%</div>
        </div>
        <div className="slider-track" ref={sliderRef} onMouseDown={handleMouseDown}>
          <div className="slider-fill" style={{ width: `${value}%` }}>
            <span className="slider-thumb">{value.toFixed(2)}</span>
          </div>

          {num !== null && (
            <div
              className={`slider-pin slider-pin${result ? "-win" : '-lose'}`}
              style={{ left: `${num}%` }}
            >
              <span className="pin-label">{num}</span>
              <img src="./public/pin.svg" alt="pin" />
            </div>
          )}
        </div>
        <div className="points-container">
          <label htmlFor="points">Поинты:</label>
          <input
            id="points"
            type="number"
            value={deposit}
            onChange={handlePointsChange}
            max={points}
            min="0"
          />
          <button onClick={()=>setDeposit(points)}>MAX</button>
          <button onClick={startGame}>PLAY</button>
        </div>
        {error && <div className="error-message">{error}</div>} {/* Display the error message */}
      </div>
    </div>
  );
}

export default Slider;
