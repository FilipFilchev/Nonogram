#PYGAME NONOGRAM DEMO
import os
import sys
import random
import pygame
from console_engine import * 
from console_engine import puzzle, grid, row_hints, col_hints



# Initialize game engine
pygame.init()

FPS = 60

# Define some colors RGB
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (100, 100, 100)
RED = (250, 10, 10)
GREEN=(0,255,0)
#Title
pygame.display.set_caption("Nonogram Puzzle Game")

# Define size of the game window
win_width = 600
win_height = 600


screen = (win_width,win_height)


# Create the game window
win = pygame.display.set_mode(screen)

# Define size of each box in the puzzle
box_size = int(500 / columns)



# Display the puzzle values in the console
print("Puzzle Board:")
for row in grid:
    print(row)


# Define the font for display of rows and columns
font = pygame.font.Font(None, 25)
font_winner=pygame.font.Font(None,100)


#Lives:
LIVES = 3

# Mistakes
def draw_x(row, col, color=RED):
    pygame.draw.line(win, color, (col * box_size, row * box_size), ((col + 1) * box_size, (row + 1) * box_size), 3)
    pygame.draw.line(win, color, ((col + 1) * box_size, row * box_size), (col * box_size, (row + 1) * box_size), 3)

# Function to display the rows and columns
def display_rows_cols():
    #Enumerating the hints lists and displaying each value on the right spot for rows&cols
    for i, num_val in enumerate(row_hints):
        text = font.render(str(num_val), True, BLACK)
        #win.blit(element, (x,y))
        win.blit(text, (510, i * box_size + box_size / 2))

    for i, num_val in enumerate(col_hints):
        text = font.render(str(num_val), True, BLACK)
        win.blit(text, (i * box_size + box_size / 2, 510))


def player_grid(rows_cols):
    # Initialize player grid with white boxes
    player_grid = [[0 for i in range(rows_cols)] for j in range(rows_cols)]
    print(player_grid)
    # return rows_cols
    return player_grid


# ...

# Create a grid for marking errors
error_grid = [[0 for _ in range(columns)] for _ in range(rows)]

# ...

def main():
    
    global winner 
    winner = False
    
    # Reset lives and error grid
    global LIVES
    LIVES = 3
    for i in range(rows):
        for j in range(columns):
            error_grid[i][j] = 0


    rows_cols=int(input("Enter number of rows and cols: "))
    if rows_cols == 5:
        p_grid=player_grid(rows_cols)
    else:  #make it a function checker
        print("Grid is limited to 5 for now.")
        rows_cols=int(input("Enter number of rows and cols: "))
        p_grid=player_grid(rows_cols)


    clock = pygame.time.Clock()
    run = True
    # ... (rest of your initializations)

    while run:
        # ... (event processing)
        #FPS
        clock.tick(FPS)
        for event in pygame.event.get():
            #If clicked the X-to-close
            if event.type == pygame.QUIT:
                exit_button=True
                run = False

            #MouseClick
            if event.type == pygame.MOUSEBUTTONUP:
                
                # Get the row and column number of the box clicked by the player
                row_clicked = int(event.pos[1] / (box_size))
                col_clicked = int(event.pos[0] / (box_size))

                # Check if the clicked cell is a mistake or not
                if p_grid[row_clicked][col_clicked] == grid[row_clicked][col_clicked]:
                    LIVES -= 1
                    print(f"You have {LIVES} Lives")
                    error_grid[row_clicked][col_clicked] = 1
                    draw_x(row_clicked, col_clicked)
                    if LIVES <= 0:
                        winner = False
                        run = False
                        print("Out of lives :(")

                # Toggle Fill the boxes white/black
                elif p_grid[row_clicked][col_clicked] == 0:
                    p_grid[row_clicked][col_clicked] = 1
                else:
                    p_grid[row_clicked][col_clicked] = 0

                #... (rest of your checks)
                if all(all(p_grid[row][col] == grid[row][col] for col in range(0,len(p_grid[row]))) for row in range(len(p_grid))):

                    winner=True
                    # run=False
     
                    # for i in range(rows):
                    #     grid.append([random.randint(0, 1) for j in range(columns)])
                    #HERE WILL BE ADDED FUNCTION TO CALL THE ENGINE AGAIN AND REGENERATE THE GRID WITH THE HINTS 


        #Clear the display            
        win.fill(WHITE)

        #Display hints
        display_rows_cols()

        #Draw
        for row in range(rows_cols):
            for col in range(rows_cols):                                                       
                pygame.draw.rect(win, GRAY, (col * box_size,row * box_size, box_size, box_size),2)
                if error_grid[row][col] == 1:  # Check if a cell is marked as a mistake
                    draw_x(row, col)
                elif p_grid[row][col] == 1:
                    pygame.draw.rect(win, BLACK, (col * box_size,row * box_size +1, box_size - 1, box_size - 1))
                # No need for p_grid value 2 as your logic doesn't seem to use it
                
        #Generate empty grid

        
        #Draw
        for row in range(rows_cols):
            for col in range(rows_cols):                                                        #thikness
                pygame.draw.rect(win, GRAY, (col * box_size,row * box_size, box_size, box_size),2)
                #   DEFINED FOR 1s
                if p_grid[row][col] == 1:
                    pygame.draw.rect(win, BLACK, (col * box_size,row * box_size +1, box_size - 1, box_size - 1))
                #   CLICKED BY THE PLAYER -> 2s
                if p_grid[row][col] == 2:
                    pygame.draw.rect(win, BLACK, (col*box_size+1,row*box_size + 1, box_size - 1, box_size - 1))
                
        if winner==True:
            p_grid.clear()
            win.fill(GREEN)
            text = font_winner.render("YOU WIN!", True, RED)
            print("You win!")
            win.blit(text, (140,230))
              
            run=False     
        #Update screen
        pygame.display.update()
        


        
    # States
    if not(run):
        print("See you!")
        if LIVES == 0:
            print("Game Over")
        else:
            print("Nice!")
   
        
    
        

    #wait time: Let player see the final screen for 5 seconds
    pygame.time.delay(5000) 
    main()  # Restart the game
    
# Quit the game
    pygame.quit()
#Restart the engine.py module (the whole file)
    #os.execv(sys.executable, ['python'] + sys.argv)
 





if __name__ == "__main__":
    main()

