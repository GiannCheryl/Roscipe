// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Homepage() {
  return (
    <div className="homepage">
      {/* <Navbar /> */}
      <div className="content">
        <Sidebar />
        <main className="main-content">
          <div className="welcome"> 
            <h1>ROSCIPE</h1>
            <p>Discover delicious recipes for every meal of the day!</p>
          </div>
        </main>
      </div>
    
    </div>  
  );
}

export default Homepage;