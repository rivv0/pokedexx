import { useState, useEffect } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Added error state
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { name, height, abilities, stats, types, moves, sprites } = data || {};

    // Filter sprite keys
    const imgList = Object.keys(sprites || {}).filter((val) => {
        if (!sprites[val]) return false;
        if (['versions', 'other'].includes(val)) return false;
        return true;
    });

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) {
            return;
        }

        let c = {};
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'));
        }

        if (move in c) {
            setSkill(c[move]);
            console.log('Found move in cache');
            setIsModalOpen(true); // Open the modal
            return;
        }

        try {
            setLoadingSkill(true);
            const res = await fetch(moveUrl);
            const moveData = await res.json();
            console.log('Fetched move from API', moveData);
            const description = moveData?.flavor_text_entries.find(val => {
                return val.version_group.name === 'firered-leafgreen';
            })?.flavor_text;

            const skillData = {
                name: move,
                description
            };
            setSkill(skillData);
            c[move] = skillData;
            localStorage.setItem('pokemon-moves', JSON.stringify(c));
            setIsModalOpen(true); // Open the modal
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoadingSkill(false);
        }
    }

    useEffect(() => {
        if (loading || !localStorage) {
            return;
        }

        let cache = {};
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon]);
            console.log('Data fetched from cache');
            return;
        }

        async function fetchPokemonData() {
            setLoading(true);
            setError(null); // Reset error state before fetching
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                const res = await fetch(finalUrl);

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const pokemonData = await res.json(); // Corrected variable name
                setData(pokemonData);

                cache[selectedPokemon] = pokemonData;
                localStorage.setItem('pokedex', JSON.stringify(cache));
            } catch (err) {
                console.error(err.message);
                setError(err.message); // Set error message
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData();
    }, [selectedPokemon]); // Removed loading from dependencies

    if (loading) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h4>Error: {error}</h4>
            </div>
        );
    }

    return (
        <div className="poke-card">
            {isModalOpen && skill && (
                <Modal handleCloseModal={() => setIsModalOpen(false)}>
                    <div>
                        <h6>Name</h6>
                        <h2>{skill.name}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description || 'No description available'}</p>
                    </div>
                </Modal>
            )}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h1>{name}</h1>
            </div>
             {sprites && sprites.front_default && (
                <img src={sprites.front_default} alt={name} style={{ width: '500px', height: '500px' }} />
            )}
            <div className="type-container">
                {types && types.length > 0 ? (
                    types.map((type, typeIndex) => (
                        <TypeCard key={typeIndex} type={type.type.name} />
                    ))
                ) : (
                    <p>No types available</p> // Fallback message if no types
                )}
            </div>
            <div className="img-container">
                {imgList.map((spriteKey, spriteIndex) => (
                    <img key={spriteIndex} src={sprites[spriteKey]} alt={`${name} ${spriteKey}`} style={{ width: '100px', height: '100px' }} />
                ))}
            </div>

            <h3>Stats</h3>
            <div className='stats-card'>
                {stats && stats.length > 0 ? (
                    stats.map((statObj, statIndex) => {
                        const { stat, base_stat } = statObj;
                        return (
                            <div key={statIndex} className='stat-item'>
                                <p>{stat?.name?.replaceAll('-', ' ') || 'N/A'}</p>
                                <h4>{base_stat}</h4>
                            </div>
                        );
                    })
                ) : (
                    <p>No stats available</p>
                )}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves && moves.length > 0 ? (
                    moves.map((moveObj, moveIndex) => {
                        return (
                            <button
                                className='button-card pokemon-move'
                                key={moveIndex}
                                onClick={() => {
                                    fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
                                }}
                            >
                                <p>{moveObj?.move?.name?.replaceAll('-', ' ') || 'N/A'}</p>
                            </button>
                        );
                    })
                ) : (
                    <p>No moves available</p>
                )}
            </div>

            {/* You can add more details here like height, abilities etc. */}
        </div>
    );
}
