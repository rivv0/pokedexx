import {first151Pokemon, getFullPokedexNumber} from '../utils'
import { useState } from 'react'
export default function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon, handleToggleMenu, showSideMenu} = props
    const [searchValue, setSearchValue] = useState('')
    const filteredPokemon = first151Pokemon.filter((ele,eleIndex) => {
        if(getFullPokedexNumber(eleIndex).includes(searchValue) || ele.toLowerCase().includes(searchValue.toLowerCase())) {
            return true
        }
        return false
    })
    return (  
        <nav className={'' + (showSideMenu ? 'open' : '')}>
            <div className={"header" + (showSideMenu ? ' open' : '')}>
                <button className='open-nav-button'>
                    <i className='fa-solid fa-arrow-left-long' onClick={handleToggleMenu}></i>
                </button>
                <h1 className='text-gradient'>Pokedex</h1>
            </div>
            <input type="text" placeholder="Search" className="search-bar" value={searchValue} onChange={(e) =>{
                setSearchValue(e.target.value)
            }} />
            {
                filteredPokemon.map((pokemon, pokemonIndex) => {
                    return (
                        
                        <button key={pokemonIndex} className={'nav-card' + (selectedPokemon === pokemonIndex ? ' nav-card-selected' : ' ')} onClick={() => setSelectedPokemon(pokemonIndex)}>
                            <p>{getFullPokedexNumber(pokemonIndex)}</p>
                            <p>{pokemon}</p>
                        </button>
                    )   
                })
            }
        </nav>  
    )
}