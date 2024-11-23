import { fetchUserProfile, initProfileHandlers } from '../profile.js';
import { initShowAllUsers } from '../friends/showAllUsers.js';
import { initFriendList } from '../friends/friendList.js';
import { fetchUserStats } from '../games/currUserStats.js';
import { initUserMatchHistory } from '../games/currUserHistory.js';

export function htmlProfile(app) {
	app.innerHTML = `
		<div class="container-fluid mt-5 mb-5">
			<h1 class="text-center mb-5">Profile</h1>
			<div id="messageContainer" class="mb-5"></div>
		</div>

		<div class="container-fluid div-custom-marge-pp">
			<div class="row">
				<div class="col-md-6 d-flex flex-column justify-content-center">
					<div class="profile-photo-wrapper">
						<img src="" alt="Profile Photo" id="profilePhoto" class="profile-photo">
						<div class="edit-overlay d-flex justify-content-center align-items-center">
							<span class="text-white fw-bold">EDIT</span>
						</div>
					</div>
				</div>
				<div class="col-md-6 d-flex flex-column justify-content-center more-marge-top-title">
					<div class="text-start">
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Username :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userUsername"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Prénom :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userFirstName"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Nom :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userLastName"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Email :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userEmail"></div>
						</div>
						<button class="btn btn-outline-primary mt-5" id="editProfileBtn">Modifier le profil</button>
						<button class="btn btn-outline-warning mt-5" id="changePasswordBtn">Changer le mot de passe</button>
					</div>				
				</div>
			</div>
		</div>

		<div class="container-fluid div-custom-marge">
			<div class="row">
				<div class="col-md-6">
					<h3 class="mt-5">
						<a class="text-decoration-none" data-bs-toggle="collapse" href="#friendListContainer" role="button" aria-expanded="false" aria-controls="friendListContainer">
							LISTE D'AMIS
						</a>
					</h3>
					<div id="friendListContainer" class="collapse text-start mt-5"></div>
					<h3 class="mt-5 d-flex align-items-center">
						<a class="text-decoration-none" data-bs-toggle="collapse" href="#allUsersContainer" role="button" aria-expanded="false" aria-controls="allUsersContainer">
							TOUS LES JOUEURS
						</a>
					<span id="newFriendRequestIndicator" class="blinking-dot d-none ms-2"></span>
					</h3>
					<div id="allUsersContainer" class="collapse text-start mt-5"></div>
				</div>
				<div class="col-md-6">
					<h3 class="mt-5">STATISTIQUES PERSONELLE</h3>
					<div class="card p-4 mb-4 mt-5" id="statsContainer">
						<p><strong>Nombre de parties jouées :</strong> <span id="totalPlayed"></span></p>
						<p><strong>Pourcentage de victoire :</strong> <span id="winPercentage"></span>%</p>
						<button class="btn btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#statsDetails" aria-expanded="false" aria-controls="statsDetails">
							Tous les modes
						</button>
						<div class="collapse mt-3" id="statsDetails">
							<table class="table table-bordered table-hover text-center">
								<thead class="table-light">
									<tr>
										<th>Mode</th>
										<th>Victoire</th>
										<th>Défaite</th>
									</tr>
								</thead>
							<tbody id="modeStatsTable"></tbody>
							</table>
						</div>
					</div>
					<h3 class="mt-5 d-flex align-items-center">
					<a class="text-decoration-none" data-bs-toggle="collapse" href="#matchHistoryContainer" role="button" aria-expanded="false" aria-controls="matchHistoryContainer">
						HISTORIQUE DES PARTIES
					</a>
					</h3>
					<div id="matchHistoryContainer" class="collapse text-start mt-5"></div>
				</div>
			</div>
		</div>
		<div class="mb-5 mt-5"></div>
		<div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="changePasswordModalLabel">Changer le mot de passe</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="changePasswordForm">
							<div class="mb-3">
								<label for="oldPassword" class="form-label">Ancien mot de passe</label>
								<input type="password" class="form-control" id="oldPassword" required>
							</div>
							<div class="mb-3">
								<label for="newPassword" class="form-label">Nouveau mot de passe</label>
								<input type="password" class="form-control" id="newPassword" required>
							</div>
							<div class="mb-3">
								<label for="confirmNewPassword" class="form-label">Confirmer le nouveau mot de passe</label>
								<input type="password" class="form-control" id="confirmNewPassword" required>
							</div>
							<button type="submit" class="btn btn-primary">Changer</button>
						</form>
						<div id="passwordChangeMessage" class="mt-3"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="friendDetailsModal" tabindex="-1" aria-labelledby="friendDetailsModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="friendDetailsModalLabel"><strong></strong></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="text-center mb-4">
							<img id="friendProfilePhoto" class="rounded-circle" src="" alt="Profile Photo" width="150" height="150">
						</div>
						<div class="text-start">
							<p><strong>Prénom :</strong> <span id="friendFirstName"></span></p>
							<p><strong>Nom :</strong> <span id="friendLastName"></span></p>
							<p><strong>Membre depuis :</strong> <span id="friendDateJoined"></span></p>
							<p><strong>Dernière connexion :</strong> <span id="friendLastLogin"></span></p>
							<p><strong>Ami depuis :</strong> <span id="friendSince"></span></p>
						</div>
						<div class="text-start mt-4">
							<h5><strong>STATISTIQUES</strong></h5>
							<p><strong>Nombre de parties jouées :</strong> <span id="friendTotalPlayed"></span></p>
							<p><strong>Pourcentage de victoire :</strong> <span id="friendWinPercentage"></span>%</p>
							<button class="btn btn-outline-info btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#friendStatsDetails" aria-expanded="false" aria-controls="friendStatsDetails">
								Tous les modes
							</button>
							<div class="collapse mt-3" id="friendStatsDetails">
								<table class="table table-bordered table-hover text-center">
									<thead class="table-light">
										<tr>
											<th>Mode</th>
											<th>Victoire</th>
											<th>Défaite</th>
										</tr>
									</thead>
									<tbody id="friendModeStatsTable"></tbody>
								</table>
							</div>
						</div>
						<div class="mt-4">
							<h5 class="mt-3">
								<a class="text-decoration-none" data-bs-toggle="collapse" href="#friendMatchHistoryContainer" role="button" aria-expanded="false" aria-controls="friendMatchHistoryContainer"">
									Historique des Parties
								</a>
							</h5>
							<div id="friendMatchHistoryContainer" class="collapse mt-3"></div>
						</div>
					</div>
					<div class="modal-footer d-flex justify-content-between">
						<button type="button" class="btn btn-danger" id="removeFriendBtn">Supprimer</button>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="editProfilePhotoModal" tabindex="-1" aria-labelledby="editProfilePhotoModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="editProfilePhotoModalLabel">Changer la photo de profil</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="profilePhotoForm">
							<div class="mb-3">
								<label for="newProfilePhoto" class="form-label">Nouvelle photo de profil :</label>
								<input type="file" class="form-control d-none" id="newProfilePhoto" name="profile_photo" accept="image/*">
								<button type="button" id="selectPhotoButton" class="btn btn-secondary">Choisir une photo</button>
								<div id="fileNameDisplay" class="mt-2 text-muted"></div>
							</div>
							<button type="button" class="btn btn-danger" id="deletePhotoButton">Supprimer la photo</button>
							<button type="submit" class="btn btn-primary float-end">Enregistrer</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="editProfileModalLabel">Modifier le profil</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="editProfileForm">
							<div class="mb-3">
								<label for="editFirstName" class="form-label">Prénom</label>
								<input type="text" class="form-control" id="editFirstName" name="first_name" required>
							</div>
							<div class="mb-3">
								<label for="editLastName" class="form-label">Nom</label>
								<input type="text" class="form-control" id="editLastName" name="last_name" required>
							</div>
							<div class="mb-3">
								<label for="editUsername" class="form-label">Nom d'utilisateur</label>
								<input type="text" class="form-control" id="editUsername" name="username" maxlength="8" required>
							</div>
							<div class="mb-3">
								<label for="editEmail" class="form-label">E-mail</label>
								<input type="email" class="form-control" id="editEmail" name="email" required>
							</div>
							<button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
						</form>
					</div>
					<div id="profileEditMessage"></div>
				</div>
			</div>
		</div>
	`;

	fetchUserProfile();
	initProfileHandlers();
	initShowAllUsers();
	initFriendList();
	fetchUserStats();
	initUserMatchHistory();
}
