import  SideNav  from "./components/SideNav"
import  Header from "./components/Header"
import  PokeCard  from "./components/PokeCard"
import  {useState}  from 'react'
function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(false)
  function handleToggleMenu() {
    setShowSideMenu(!showSideMenu)
  }

  return (
    <>
      <Header handleToggleMenu ={handleToggleMenu} />
      <SideNav showSideMenu= {showSideMenu} selectedPokemon = {selectedPokemon} setSelectedPokemon = {setSelectedPokemon} handleToggleMenu = {handleToggleMenu}/>
      <PokeCard  selectedPokemon={selectedPokemon}/>
    </>
  )
}

export default App
