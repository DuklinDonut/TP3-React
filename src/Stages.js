import { useState } from 'react';

function FilterableStageTable({ stages }) {
  const [filterText, setFilterText] = useState('');
  const [inBaseOnly, setInBaseOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inBaseOnly={inBaseOnly} 
        onFilterTextChange={setFilterText}
        onInBaseOnlyChange={setInBaseOnly}  />
      <StageTable 
        stages={stages}
        filterText={filterText}
        inBaseOnly={inBaseOnly} />
    </div>
  );
}


function StageCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

//couleur basée sur l'état du stage
function StageRow({ stage }) {
  let color;
  switch (stage.etat) {
    case 'disponible':
      color = 'green';
      break;
    case 'affecté':
      color = 'orange';
      break;
    case 'terminé':
      color = 'red';
      break;
    default:
      color = 'black'; 
  }

  return (
    <tr>
      <td style={{ color: color }}>
        {stage.name}
      </td>
      <td>{stage.etat}</td>
    </tr>
  );
}


function StageTable({ stages, filterText, inBaseOnly }) {
  const rows = [];
  let lastCategory = null;

  stages.forEach((stage) => {
    if (stage.category.toLowerCase().indexOf(
      filterText.toLowerCase()
    ) === -1
    ) {
      return;
    }
    if (inBaseOnly && stage.etat !== 'disponible') {
      return;
    }
    if (stage.category !==lastCategory){
      rows.push(
        <StageCategoryRow
          category={stage.category}
          key={stage.category} />
      );
    }
      
    rows.push(
      <StageRow
        stage={stage}
        key={stage.name} />
    );
    lastCategory = stage.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Intitulé</th>
          <th>Etat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inBaseOnly, onFilterTextChange, onInBaseOnlyChange }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
        />
      <label>
        <input 
          type="checkbox" 
          checked={inBaseOnly} 
          onChange={(e) => onInBaseOnlyChange(e.target.checked)}
          />
        {' '}
        Only show available in base stages
      </label>
    </form>
  );
}

function Home () {

}

function About () {
  
}

function Contact () {
  
}

const STAGES = [
  {category: "Informatique", etat: "disponible", name: "Miage"},
  {category: "Gestion", etat: "affecté", name: "Contrôle de gestion"},
  {category: "Ressources humaines", etat: "terminé", name: "Recrutement"},
  {category: "Informatique", etat: "affecté", name: "Miage"},
  {category: "Achats", etat: "disponible", name: "Achat MP"},
  {category: "Informatique", etat: "terminé", name: "Génie logiciel"}
];

export default function Stages() {
  return <FilterableStageTable stages={STAGES} />;
}
