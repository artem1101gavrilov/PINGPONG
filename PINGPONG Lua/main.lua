Player1 = {x = 0, y = 0, dlina = 80}
Player2 = {x = 0, y = 0, dlina = 80}
speed = 3
local ball = { x = 0, y = 0, vx = -speed, vy = speed, size = 10 }
score1 = 0
score2 = 0
bonusi = {}

-- Randomly returns either -1 or 1.
function math.rsign() return love.math.random(2) == 2 and 1 or -1 end

--[[
	Список возможных бонусов и наоборот:
	12 - 34. Увеличение или уменьшение ракетки (5-10 сек)
	--3 - 4. Ракетка без движения на 5-10 сек
	5 - 6. Большой или маленький шар
	7 - 8. Быстрая скорость шара или медленная 
]]

function love.load()
	math.randomseed( os.time() )
	love.window.setMode(500, 500)
	love.graphics.setBackgroundColor( 43, 77, 168 )
	Player1.x = 50
	Player1.y = 240
	Player1.dlina = 80
	Player2.x = 440
	Player2.y = 240
	Player2.dlina = 80
	
	speed = 3

	ball.x = 250
	ball.y = 280
	ball.vx = -speed * math.rsign()
	ball.vy =  math.random(-speed, speed)
	ball.size = 10
	score1 = 0
	score2 = 0

	if ball.vx < 0 then  
		KudaLetit = 1
	else
		KudaLetit = 2
	end

	timeGame = 0
	timeBonus = 0  

	mainFont = love.graphics.newFont(20);
	love.graphics.setFont(mainFont);

	finishGame = false
	rezhim1 = false

	TimeBig1 = 0
	TimeBig2 = 0
	TimeSmall1 = 0
	TimeSmall2 = 0
	TimeFreeze1 = 0
	TimeFreeze2 = 0
	--TimeFastSpeed = 0
	--TimeSlowSpeed = 0

end
 
function love.update(dt)
	--for startgame
	local x, y = love.mouse.getPosition()
	if x > 150 and x < 350 and y > 50 and y < 70 then
		rezhim1 = true
	else
		rezhim1 = false
	end

	if timeGame > 60 then
		finishGame = true
	else
		timeGame = timeGame + dt
		timeBonus = timeBonus + dt
	end
	if finishGame == false then
		if love.keyboard.isDown('w') then
			if Player1.y > 80 then
				Player1.y = Player1.y - 10
			end
		end
		if love.keyboard.isDown('s') then
			if (Player1.y + Player1.dlina) < 480 then
				Player1.y = Player1.y + 10
			end
		end
		if love.keyboard.isDown('up') then
			if Player2.y > 80 then
				Player2.y = Player2.y - 10
			end
		end
		if love.keyboard.isDown('down') then
			if (Player2.y + Player2.dlina) < 480 then
				Player2.y = Player2.y + 10
			end
		end
		
		ball.x = ball.x + ball.vx
		ball.y = ball.y + ball.vy
		if (ball.x + ball.size/2) > 450 or (ball.x - ball.size/2) < 50 then 
			ball.vx = -ball.vx 
		end
		if (ball.y + ball.size/2) > 480 or (ball.y - ball.size/2) < 80 then 
			ball.vy = -ball.vy 
		end
		
		--С первой ракеткой
		if ball.x <= (60+ball.size) and ball.x >= 60 and (Player1.y - ball.size/4) <= ball.y and (Player1.y + Player1.dlina + ball.size/4) >= ball.y then
			speed = speed + 0.5
			ball.x = 60+ball.size
			ball.vx = speed
			ball.vy = ball.vy + math.random(-50, 50) / 100 * speed
			KudaLetit = 2
		end
		if ball.x < 61 then
			ball.x = 250
			ball.y = 280
			speed = 3
			ball.vx = -speed
			ball.vy =  math.random(-speed, speed)
			score2 = score2 + 1
			ball.size = 10
			Player1.dlina = 80
			Player2.dlina = 80
			if (Player1.y + Player1.dlina) > 480 then
				Player1.y = 480 - Player1.dlina
			end
			if (Player2.y + Player2.dlina) > 480 then
				Player2.y = 480 - Player2.dlina
			end
		end

		--со второй ракеткой
		if ball.x <= 440 and ball.x >= (440-ball.size) and (Player2.y-ball.size/4) <= ball.y and (Player2.y + Player2.dlina + ball.size/4) >= ball.y then
			speed = speed + 0.5
			ball.x = 440-ball.size
			ball.vx = -speed
			ball.vy = ball.vy + math.random(-5, 5) / 10 * speed
			KudaLetit = 1
		end
		if ball.x > 440 then
			ball.x = 250
			ball.y = 280
			speed = 3
			ball.vx = speed
			ball.vy = math.random(-speed, speed)
			score1 = score1 + 1
			ball.size = 10
			Player1.dlina = 80
			Player2.dlina = 80
			if (Player1.y + Player1.dlina) > 480 then
				Player1.y = 480 - Player1.dlina
			end
			if (Player2.y + Player2.dlina) > 480 then
				Player2.y = 480 - Player2.dlina
			end
		end

		if timeBonus > 2 then
			point = { x = math.random(70, 430);					--и снова X..
				  	y = math.random(80, 470);
				  	bonus =  math.random(1, 8) }	
			table.insert(bonusi, point)
			timeBonus = 0
		end

		for k, v in pairs(bonusi) do
			if ball.x >= v.x and ball.x <= (v.x+10) and ball.y >= v.y and ball.y <= (v.y+10) or
			 (ball.x+ball.size) >= v.x and (ball.x+ball.size) <= (v.x+10) and ball.y >= v.y and ball.y <= (v.y+10) or 
			 (ball.x-ball.size) >= v.x and (ball.x-ball.size) <= (v.x+10) and ball.y >= v.y and ball.y <= (v.y+10) or 
			 ball.x >= v.x and ball.x <= (v.x+10) and (ball.y+ball.size) >= v.y and (ball.y+ball.size) <= (v.y+10) or 
			 ball.x >= v.x and ball.x <= (v.x+10) and (ball.y-ball.size) >= v.y and (ball.y-ball.size) <= (v.y+10) then
				if v.bonus == 1 then
					Player1.dlina = 120
					if (Player1.y + Player1.dlina) > 480 then
						Player1.y = 480 - Player1.dlina
					end
				end
				if v.bonus == 2 then
					Player2.dlina = 120
					if (Player2.y + Player2.dlina) > 480 then
						Player2.y = 480 - Player2.dlina
					end
				end
				if v.bonus == 3 then
					Player1.dlina = 40
				end
				if v.bonus == 4 then
					Player2.dlina = 40
				end
				if v.bonus == 5 then
					ball.size = 20
				end
				if v.bonus == 6 then
					ball.size = 5
				end
				if v.bonus == 7 then
					speed = 33
				end
				if v.bonus == 8 then
					speed = 1
				end
				table.remove(bonusi, k)
			end 			        
		end
	end
end

function love.keyreleased(key, unicode)
	if key == "r" then
		love.load()
	end
end 
 
function love.keypressed(key, unicode)
	
end

function love.mousereleased(x, y, button, istouch)
   if button == 1 then
   	if x > 150 and x < 350 and y > 50 and y < 70 then
   		for k, v in pairs(bonusi) do
			table.remove(bonusi, k)		        
		end
		love.load()
	end
   end
end

function love.draw()
	if rezhim1 == true then
		love.graphics.setColor(250, 250, 0)
	else
		love.graphics.setColor(250, 250, 250)
	end
	love.graphics.rectangle("fill", 150, 50, 200, 20)
	love.graphics.setColor(0, 0, 0)
	love.graphics.print("retry", 235, 50)

	love.graphics.setColor(250, 250, 250)
	love.graphics.print(score1, 100, 20)
	love.graphics.print(string.format("%10.1f", timeGame), 200, 20)
	love.graphics.print(score2, 400, 20)



	love.graphics.setColor(130, 130, 130)
	love.graphics.rectangle("fill", 50, 80, 400, 400)

	love.graphics.setColor(200, 0, 0)
	love.graphics.rectangle("fill", Player1.x, Player1.y, 10, Player1.dlina)

	love.graphics.setColor(0, 0, 200)
	love.graphics.rectangle("fill", Player2.x, Player2.y, 10, Player2.dlina)

	love.graphics.setColor(0, 200, 0)
	love.graphics.circle("fill", ball.x, ball.y, ball.size)

	for k, v in pairs(bonusi) do 			
		love.graphics.setColor(0, 0, 0)
		love.graphics.rectangle("fill",  v.x, v.y, 10, 10)  
	end
end