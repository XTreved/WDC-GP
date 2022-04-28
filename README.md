This is our WDC project. Please make a branch when you start working on something so we don't commit straight to master.


Below, Nick has summarised some info on using git that he's learnt for this project. Please feel free to read over and make changes as its very possible he has misunderstood something in the documentation. Otherwise, try your best to follow the 11-step workflow detailed as it will mean we can maintain full history of changes, so if something breaks we can always revert.

## How to use the git CLI to safely make changes to a repo

1. `cd` To the directory where you want to keep the repo locally
1. Run `git clone https://github.com/XTreved/WDC-GP`. This brings a copy of the whole repository into your directory.
1. Run `git branch` to check what branch you are currently actively editing (should be master)
    1. Run `git branch [branch_name]` to create a new branch if needed
1. Run `git checkout [branch_name]` to change the focus of your directory to the new branch. Checkout moves you between branches and is not like svn checkout.
1. Make your changes
1. `git add [your files]` to mark your files as part of the next commit
1. `git commit -m "[your commit message]"` to commit your changes to your local copy of the branch

Now your changes are committed locally, it's time to finalise your changes by checking for conflicts with origin/master (the shared copy of master, see 'About git' below for info), resolving any conflicts, merging your local development branch with your local master branch and, finally, pushing your local master branch to the remote origin so everyone actually has your changes.

8. `git fetch` to bring down the latest copy of the origin branches
9. `git merge origin/master` to attempt to merge your current checked-out branch with latest origin version of master. If there are major breaking conflicts, run `git merge --abort` to cancel merging, consult your teammates and decide what to do. Then re-try from step 8. If no conflicts were detected, merge will also automatically commit for you so you can skip to step 11.

I recommend reading <a href="https://www.simplilearn.com/tutorials/git-tutorial/merge-conflicts-in-git">https://www.simplilearn.com/tutorials/git-tutorial/merge-conflicts-in-git</a> to learn more about how to resolve conflicts when merging.

When your merge fails because of conflicts, git would have placed conflict markers in your files on this branch and told you which files it has done this for. You need to go back and edit these files, make the best decision about what to keep, then re `git add` the file which you have edited.

10. Once all conflicts are resolved your branch is now merged with master, so run `git commit -m "[commit message]"` to save these changes.

Congrats. You just made changes to our code base, checked what your teammates have done since your changes and integrated their new code with your new work before publishing to the rest of your team.
Now you just need to push your changes to the remote origin.

11. `git push -u origin [branch_name]` this will push your changes upstream (-u) to the origin.

All your changes to the code base are now stored in your branch, along with any other changes that other people made to master in the time it took you to make your changes.
Now go to Github and create a Pull Request to pull your branch into master.

## About git
Git works by keeping work on branches. In git, all work lives on a branch at any given point. The master branch is the top-level branch and all other branches come from it. Therefore, with multiple people working on one repository at once, a single branch on your local machine can contain both newer and older code compared to the master branch.
This is why git relies on this concept of branches. If we all committed our changes straight to master, it would very quickly become a problem if two people worked on the same file as we would have no way to resolve what changes to keep as there is no branch above master.
Multiple people can work on a branch, however, because as one person pushes their changes, the other can pull them and check the conflicts before pushing their copy.

Git keeps both remote and local versions of branches. The remote copies are accessible to everyone. We download our local copies from remote so we can work on a branch. As the remote group of branches is the source of all edits, it is referred to as the 'origin'. 
Once you finish staging and committing your changes on a local branch, you should rebase or merge your local dev branch with your local copy of master. This will force you to resolve any conflicts locally before you finalise your changes. Once there are no conflicts, you then must 'push' your copy of master to the origin for it to become final. This process forces you to fix any conflicts on your local machine before you can update the origin. 

When you start working on something new, it's best to make a new branch. IE, when we start developing the express server backend, someone would make a branch for 'back_end_dev'. You could then make branches from there for each individual task, such as 'public_HTML_pages', or just make your edits straight in that development branch.

When merging your branches and resolving conflicts, it may be useful to go over <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line">this Github doc page</a>.

I'm not making this up, I've just spent a few hours reading Github documentation and best practices and wanted to summarise it here. If you want to do the same, Github documentation is available at <a href=https://docs.github.com/en>https://docs.github.com/en</a>. 
