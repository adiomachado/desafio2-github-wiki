// Observação: Este arquivo é parte de uma aplicação React que busca repositórios do GitHub 
// e os exibe em uma lista, permitindo que o usuário adicione, acesse e remova repositórios.

import { useState } from 'react';
import gitLogo from '../assets/github.png';
import Input from '../components/Input';
import Button from '../components/Button';
import ItemRepo from '../components/ItemRepo';
import { api } from '../services/api';

import { Container } from './styles'; 

function App() {

    const [currentRepo, setCurrentRepo] = useState('');
    const [repos, setRepos] = useState([]);

    const handleSearchRepo = async () => {

      try {    //-- Verifica se o campo de entrada está vazio
        if (!currentRepo.trim()) {
          alert('Por favor, insira o nome do repositório.');
          return;
        }
        //-- Verifica se o repositório já foi adicionado
        const { data } = await api.get(`repos/${currentRepo}`)      
        
        if(data.id){
          //-- Verifica se o repositório já existe na lista
          const repoExists = repos.find(repo => repo.id === data.id);
          //-- Se não existir, adiciona o repositório à lista
          //-- Se existir, exibe um alerta
          if(!repoExists) {
            setRepos(prev => [...prev, data]);
            setCurrentRepo('');
            return;
          } else {
            alert('Repositório já adicionado!');
            setCurrentRepo('');
            return;
          }          
        } 
        alert('Repositório não encontrado!');
      }
      catch (error) { //-- Captura erros na requisição no caso de repositório não encontrado ou erro na API
        console.error('Erro ao buscar repositório:', error);
        alert('Erro ao buscar repositório. Verifique o nome e tente novamente.');
      }
    };
    //-- Função para remover um repositório da lista
    const handleRemoveRepo = (id) => {   
      // Filtra os repositórios para remover o que tem o id correspondente
      const updatedRepos = repos.filter(repo => repo.id !== id);
      setRepos(updatedRepos);

      alert('Repositório removido com sucesso!');
    }

  return (
    //-- Renderiza o componente principal da aplicação
    //-- Exibe o logo do GitHub, campo de entrada, botão de busca e lista de repositórios
    //-- Cada repositório é renderizado usando o componente ItemRepo
    <Container>
      <img src={gitLogo} width={72} height={72} alt="GitHub Logo" />
      <Input value={currentRepo} onChange={(e) => setCurrentRepo(e.target.value)} />
      <Button onClick={handleSearchRepo}/>
      <hr />
      {repos.map(repo => (
        <ItemRepo key={repo.id} repo={repo} handleRemoveRepo={handleRemoveRepo} />
      ))}
    </Container>      
  );
}

export default App;
