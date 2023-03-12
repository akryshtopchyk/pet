import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div>
      <h2>Похоже, вы потерялись...</h2>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
}

export default NoMatch