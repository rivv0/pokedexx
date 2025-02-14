import { pokemonTypeColors } from "../utils";

export default function TypeCard(props) {
    const { type } = props;

    // Get color and background color safely
    const typeColor = pokemonTypeColors?.[type] || { color: 'black', backgroundColor: 'white' }; // Default colors if type not found

    return (
        <div className="type-tile" style={{ color: typeColor.color, backgroundColor: typeColor.backgroundColor }}>
            <p>{type}</p>
        </div>
    );
}
