import { makeAutoObservable } from "mobx";
import { getTeam, updateTeam, deleteTeam, addTeam } from "../API/team.api";
class ListTeams {
  teams = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTeams = (teams) => {
    this.teams = teams;
  };

  getTeams = (id) => {
    getTeam(id).then((teams) => {
      this.setTeams(teams);
    });
  };
  addTeams = (team) => {
    addTeam(team)
      .then((result) => {
        if (result === "ok") {
          this.getTeams('')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTeams = (team) => {
    updateTeam(team)
      .then((result) => {
        if (result === "ok") {
          this.getTeams('')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteTeams = (id) => {
    deleteTeam(id)
      .then((result) => {
        if (result === "ok") {
          this.getTeams('')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default ListTeams;
