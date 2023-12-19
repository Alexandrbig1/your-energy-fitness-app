const backdropRef = document.querySelector('.backdrop');

export function toggleModalOpen(modalRef) {
  backdropRef.classList.add('open');
  modalRef.classList.add('open');
}

export function toggleModalClose(modalRef) {
  backdropRef.classList.remove('open');
  modalRef.classList.remove('open');
}
